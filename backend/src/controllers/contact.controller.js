import asyncHandler from "../utils/asyncHandler.js";
import { Contact } from "../models/contact.model.js";
import { ApiResponse } from "../utils/response.js";

// @desc    Submit a contact message
// @route   POST /api/v1/contacts
// @access  Public
export const submitContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        message
    });

    res.status(201).json(new ApiResponse(201, contact, "Message sent successfully"));
});

// @desc    Get all contact messages
// @route   GET /api/v1/contacts
// @access  Private/Admin
export const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, contacts, "Contacts retrieved successfully"));
});
