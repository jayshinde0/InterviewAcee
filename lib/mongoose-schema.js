// Mongoose Schema for Simplified User Model
// Use this schema definition for MongoDB with Mongoose

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  profilePhoto: { type: String, default: "" } // URL or image path
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
