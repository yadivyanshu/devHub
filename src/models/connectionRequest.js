const mongoose = require('mongoose');
const schema = mongoose.Schema;

const connectionRequestSchema = new schema(
    {
        fromUserId: {type: schema.Types.ObjectId, required: true, ref: 'User'},
        toUserId: {type: schema.Types.ObjectId, required: true},
        status: {
            type: String, 
            required: true,
            enum: {
                values: ['interested', 'accepted', 'rejected', 'ignored'],
                message: `{VALUE} is invalid status. Valid values are interested, accepted, rejected, ignored`
            },
        }
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true});

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send connection request to yourself");
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;