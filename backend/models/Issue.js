import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Infrastructure', 'Other'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
        imagePublicId: {
            type: String,
            default: '',
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
            default: 'Pending',
        },
        location: {
            building: {
                type: String,
                required: [true, 'Please provide a building/location'],
            },
            floor: {
                type: String,
            },
            room: {
                type: String,
            },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        resolvedAt: {
            type: Date,
        },
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for upvote count
issueSchema.virtual('upvoteCount').get(function () {
    return this.upvotes ? this.upvotes.length : 0;
});

// Indexes for better query performances
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ 'location.building': 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
