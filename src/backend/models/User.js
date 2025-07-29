// Backend/models/User.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Please fill a valid email form"],
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        isHR: {
            type: Boolean,
            default: false,
        },
        registerType: {
            type: String,
            enum: ["normal", "google", "microsoft"],
            default: "normal"
        },
        socialId: {
            type: String,
            unique: true,
            sparse: true
        },
        // Anda bisa tambahkan ini jika user (HR) memiliki daftar kandidat yang dia kelola secara langsung
        // candidatesManaged: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Candidate'
        // }]
        // Tidak perlu interviewHistory lagi di User, karena wawancara akan dihubungkan ke Candidate.
        // Jika perlu riwayat HR yang membuat interview, bisa dicek melalui Interview.userId
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (next) {
    if (this.password && (this.isNew || this.isModified("password"))) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;