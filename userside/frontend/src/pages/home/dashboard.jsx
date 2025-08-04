import React from 'react';
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SummaryCard from '../../components/cards/SummaryCard';
import moment from 'moment';
import Modal from '../../components/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../../components/loader/DeleteAlertContent';
import PartnerFooter from '../../components/PartnerFooter';
import ChatBubble from '../../components/ChatbotBubble';
import ChatbotForm from '../../components/ChatbotForm';

const Dashboard = () => {
    const navigate = useNavigate();

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        open: false,
        data: null,
    });
    
    const fetchAllSessions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
            setSessions(response.data);
        } catch (error) {
            console.error("Error fetching session data:", error)
        }
    };
    
    const deleteSession = async (sessionData) => {
        try {
            await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
            
            toast.success("Session Deleted Successfully");
            setOpenDeleteAlert({
                open: false,
                data: null,
            });
            fetchAllSessions();
        } catch (error) {
            console.error("Error deleting session data:", error);
        }
    };

    const renderedCards = sessions?.map((data, index) => {
        const colors = CARD_BG[index % CARD_BG.length];
        const bgcolors = CARD_BG[index % CARD_BG.length].bgcolor;

        return (
            <SummaryCard
                key={data?._id}
                colors={colors}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                    data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                }
                onSelect={() =>
                    navigate(`/interview-prep/${data?._id}?color=${encodeURIComponent(bgcolors)}`)
                }
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
            />
        );
    });

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    useEffect(() => {
        fetchAllSessions();
    }, []);

    return (
        <>
        <DashboardLayout>
            <div className="container mx-auto pt-4 pb-4">
                <div className="flex items-center justify-between px-4 md:px-0 pb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        Interview Hack with AI
                    </h2>

                    <button
                        className="h-10 md:h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-5 py-2 rounded-2xl hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300"
                        onClick={() => setOpenCreateModal(true)}
                    >
                        <LuPlus className="text-xl md:text-2xl text-white" />
                        Add New
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
                    {renderedCards}
                </div>
            </div>

            <Modal
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                hideHeader
            >
                <div>
                    <CreateSessionForm />
                </div>
            </Modal>

            <Modal
                isOpen={openDeleteAlert?.open}
                onClose={()=>{
                    setOpenDeleteAlert({open:false, data:null});
                }}
                title="Delete Alert"
            >
                <div className=''>
                    <DeleteAlertContent
                        content="Are you sure you want to delete this session detail?"
                        onDelete={()=>deleteSession(openDeleteAlert.data)}
                    />
                </div>
            </Modal>

            {isChatbotOpen && (
                <div className="fixed bottom-20 right-[130px] z-50">
                    <ChatbotForm onClose={toggleChatbot} />
                </div>
            )}

            <div className="fixed bottom-5 right-5 z-50 cursor-pointer" onClick={toggleChatbot}>
                <ChatBubble />
            </div>
        </DashboardLayout>
        <PartnerFooter/>
        </>
    );
};

export default Dashboard;