import {prisma} from "../../DB/config.js"

export const getOrCreateConversation = async(req,res) => {
    const {userAId, userBId, postId, purchaseRequestId} = req.body
    if (!userAId || !userBId || !postId) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try{
        let conversation = await prisma.conversation.findFirst({
            where: { 
                userAId, 
                userBId, 
                postId 
            },
            include: { 
                messages: true },
    });

    if(!conversation){
        conversation = await prisma.conversation.create({
            data: {
                userAId,
                userBId,
                postId,
                purchaseRequestId,
            },
            include: { messages: true },
        });
    }

    res.status(200).json(conversation);
  }catch(error){
        console.error("Error creating/getting conversation:", error);
        res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getMessages = async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const conversation = await prisma.conversation.findUnique({
        where: { 
            id: Number(conversationId) 
        },
        select: { 
            userAId: true, 
            userBId: true 
        },
    });

    if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.userAId !== userId && conversation.userBId !== userId) {
        return res.status(403).json({ message: "Access denied to this chat" });
    }
    try{
        const messages = await prisma.message.findMany({
            where: { 
                conversationId: Number(conversationId) 
            },
            orderBy: { 
                createdAt: "asc" 
            },
            include: {
                sender: {
                    select: { 
                        id: true, 
                        userName: true, 
                        imgUrl: true },
                },
            },
        });

        res.status(200).json(messages);
    }catch(error){
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const sendMessage = async (req, res) => {
    const { conversationId, senderId, text } = req.body;

    if(!conversationId || !senderId || !text){
        return res.status(400).json({ 
            message: "conversationId, senderId and text are required" 
        });
    }

    try {
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                text,
            },
            include: {
                sender: {
                select: { id: true, userName: true, imgUrl: true },
                },
            },
        });

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all conversations for the authenticated user
export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { userAId: userId },
                    { userBId: userId }
                ]
            },
            include: {
                userA: {
                    select: { 
                        id: true, 
                        userName: true, 
                        name: true, 
                        imgUrl: true }
                },
                userB: {
                    select: { 
                        id: true, 
                        userName: true, 
                        name: true, 
                        imgUrl: true }
                },
                post: {
                    select: { 
                        id: true, 
                        itemName: true, 
                        itemImgUrl: true, 
                        authorId: true }
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    include: {
                        sender: {
                            select: { id: true, userName: true, name: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc" // Most recent conversations first
            }
        });

        const conversationsWithOtherUser = conversations.map(conv => {
            const currentUserId = Number(userId);
            const userAId = Number(conv.userAId);
            const userBId = Number(conv.userBId);
            
            let otherUser;
            if (userAId === currentUserId) {
                otherUser = conv.userB;
            } else if (userBId === currentUserId) {
                otherUser = conv.userA;
            } else {
                console.error(`⚠️ Conversation ${conv.id}: Current user ${currentUserId} is neither userA (${userAId}) nor userB (${userBId})`);
                otherUser = conv.userB; // Default fallback
            }
            
            if (!otherUser) {
                console.warn(`⚠️ Conversation ${conv.id}: Other user is null/undefined`);
            } else if (Number(otherUser.id) === currentUserId) {
                console.warn(`⚠️ Conversation ${conv.id}: Other user (${otherUser.id}) matches current user (${currentUserId})`);
            }
            
            return {
                ...conv,
                otherUser: otherUser, 
                currentUserId: currentUserId 
            };
        });

        res.status(200).json(conversationsWithOtherUser);
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};