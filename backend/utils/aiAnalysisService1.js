import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import OpenAI from 'openai';
import Interview from '../models/Interview.js'; // Import the Interview model
import Candidate from '../models/Candidate.js'; // Import the Candidate model
import { BASE_UPLOADS_DIR } from './fileUploadService.js';

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
} else {
    console.error("ffmpeg-static path not found. Please ensure 'ffmpeg-static' is installed correctly.");
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openaiClient = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});


export async function processAiAnalysis(interviewId) {
    try {
        const interview = await Interview.findById(interviewId).populate('candidateId');
        if (!interview || !interview.candidateId) {
            console.error(`Interview or Candidate with ID ${interviewId} not found.`);
            return;
        }

        const candidate = interview.candidateId;
        // The recordingUrl is now relative to the single BASE_UPLOADS_DIR
        const localFileName = path.basename(interview.recordingUrl);
        const localFilePath = path.join(BASE_UPLOADS_DIR, localFileName);
        let audioFilePath;

        // 2. Extract audio if the recording is a video
        if (interview.recordingType === 'video') {
            const audioFileName = `${path.parse(localFileName).name}.mp3`;
            // Create a temporary audio path in the same BASE_UPLOADS_DIR
            audioFilePath = path.join(BASE_UPLOADS_DIR, audioFileName);
            
            await extractAudioFromVideo(localFilePath, audioFilePath);
        } else {
            audioFilePath = localFilePath;
        }
        
        // 3. Transcribe the audio
        const mimeType = interview.recordingType === 'video' ? 'audio/mpeg' : 'audio/mp3';
        const transcription = await transcribeAudioWithWhisper(audioFilePath, mimeType);
        
        // 4. Analyze the transcription with the Qwen model
        const analysisResult = await analyzeInterviewWithQwen(transcription, candidate.position);
        
        // 5. Update the interview document with the results
        interview.aiAnalysisResult = analysisResult;
        interview.overallAiScore = analysisResult.scores.overallScore;
        interview.overallAiFeedback = analysisResult.summary;
        interview.aiScores = analysisResult.scores;
        interview.processStatus = 'Analysis Complete';
        await interview.save();
        
        // Clean up the temporary audio file
        if (interview.recordingType === 'video' && fs.existsSync(audioFilePath)) {
            fs.unlinkSync(audioFilePath);
            console.log(`Temporary audio file deleted: ${audioFilePath}`);
        }
        
        console.log(`AI analysis for interview ${interviewId} completed successfully.`);
        
    } catch (analysisError) {
        // ... (error handling remains the same)
    }
}


export async function extractAudioFromVideo(videoFilePath, outputAudioPath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(videoFilePath)) {
            return reject(new Error(`Source video file not found for conversion: ${videoFilePath}`));
        }
        ffmpeg(videoFilePath)
            .noVideo()
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', () => {
                console.log(`Audio extracted and converted to MP3: ${outputAudioPath}`);
                resolve(outputAudioPath);
            })
            .on('error', (err) => {
                console.error('Error extracting audio from video:', err.message);
                reject(new Error(`Failed to extract audio from video: ${err.message}`));
            })
            .save(outputAudioPath);
    });
}

export async function transcribeAudioWithWhisper(audioFilePath, mimeType) {
    if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Local audio file not found for transcription: ${audioFilePath}`);
    }
    const audioBuffer = fs.readFileSync(audioFilePath);
    const WHISPER_MODEL_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";

    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is not set in environment variables. Please provide your Hugging Face API token.");
    }

    try {
        console.log(`Sending ${path.basename(audioFilePath)} (${mimeType}) to Hugging Face Whisper for transcription...`);
        const response = await fetch(
            WHISPER_MODEL_URL,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": mimeType,
                },
                method: "POST",
                body: audioBuffer,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face Whisper API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        const transcription = result.text;
        console.log("Hugging Face Whisper Transcription Result:", transcription);
        return transcription;

    } catch (error) {
            console.error('Error during Hugging Face Whisper transcription:', error);
            throw new Error('Whisper transcription failed: ' + error.message);
    }
}


export async function analyzeInterviewWithQwen(transcription, interviewType) {
    const QWEN_MODEL_ID = "Qwen/Qwen2.5-32B:featherless-ai";
    const MAX_TRANSCRIPT_LENGTH = 8000;

    const truncatedTranscription = transcription.substring(0, MAX_TRANSCRIPT_LENGTH);
    if (transcription.length > MAX_TRANSCRIPT_LENGTH) {
        console.warn(`Transcription truncated from ${transcription.length} to ${MAX_TRANSCRIPT_LENGTH} characters for LLM analysis.`);
    }

    const systemPrompt = `You are an AI assistant specialized in human resources. Your task is to analyze interview transcripts and provide a comprehensive summary and detailed scoring based on specific criteria. Your analysis should be objective and data-driven.`;

    const userPrompt = `Analyze the following interview transcript for a "${interviewType}" position.

    Transcript:
    "${truncatedTranscription}"

    First, provide a concise summary of the interview, highlighting the candidate's strengths, weaknesses, and overall suitability for the role.

    Second, provide a numerical rating for the candidate on a scale of 0 to 100 for each of the following criteria, along with a brief justification for each score:
    - Overall
    - Professionalism
    - Critical Thinking
    - Communication
    - Teamwork
    - Leadership

    Present your final output as a single JSON object. Ensure the JSON is valid and complete.

    Example JSON format:
    {
      "summary": "...",
      "scores": {
        "overallScore": N,
        "professionalismScore": N,
        "criticalThinkingScore": N,
        "communicationScore": N,
        "teamworkScore": N,
        "leadershipScore": N
      },
      "justifications": {
        "overall": "...",
        "professionalism": "...",
        "criticalThinking": "...",
        "communication": "...",
        "teamwork": "...",
        "leadership": "..."
      },
      "nextStepsRecommendation": "..." // (Optional, you can let the model generate this or hardcode)
    }
    `;

    try {
        console.log(`Sending transcription to Qwen2.5-32B for analysis...`);
        const chatCompletion = await openaiClient.chat.completions.create({
            model: QWEN_MODEL_ID,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.1, 
            max_tokens: 1500, 
            response_format: { type: "json_object" }
        });

        const rawResult = chatCompletion.choices[0].message.content;
        console.log("Qwen Analysis Raw Result:", rawResult);

        let parsedResults;
        try {
            parsedResults = JSON.parse(rawResult);
        } catch (parseError) {
            console.error("Failed to parse Qwen JSON response:", rawResult, parseError);
            const fallbackSummary = rawResult.split('\n')[0];
            const fallbackScores = {
                overallScore: null, professionalismScore: null, criticalThinkingScore: null,
                communicationScore: null, teamworkScore: null, leadershipScore: null
            };
            return {
                summary: fallbackSummary,
                scores: fallbackScores,
                justifications: { overall: "Failed to parse detailed justifications." },
                nextStepsRecommendation: "Manual review needed due to parsing error."
            };
        }

        const validatedScores = {
            overallScore: typeof parsedResults.scores?.overallScore === 'number' ? parsedResults.scores.overallScore : null,
            professionalismScore: typeof parsedResults.scores?.professionalismScore === 'number' ? parsedResults.scores.professionalismScore : null,
            criticalThinkingScore: typeof parsedResults.scores?.criticalThinkingScore === 'number' ? parsedResults.scores.criticalThinkingScore : null,
            communicationScore: typeof parsedResults.scores?.communicationScore === 'number' ? parsedResults.scores.communicationScore : null,
            teamworkScore: typeof parsedResults.scores?.teamworkScore === 'number' ? parsedResults.scores.teamworkScore : null,
            leadershipScore: typeof parsedResults.scores?.leadershipScore === 'number' ? parsedResults.scores.leadershipScore : null
        };
        
        return {
            summary: parsedResults.summary || "No summary provided by AI.",
            scores: validatedScores,
            justifications: parsedResults.justifications || {},
            nextStepsRecommendation: parsedResults.nextStepsRecommendation || "No specific recommendation from AI."
        };

    } catch (error) {
        console.error('Error during Qwen analysis:', error);
        throw new Error('Qwen analysis failed: ' + error.message);
    }
}