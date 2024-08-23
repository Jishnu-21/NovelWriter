const { UserInputError } = require('apollo-server-express');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const resolvers = {
    Query: {
        hello: () => 'Hello World!',
    },
    Mutation: {
        sendMessage: async (_, { messages }) => {
            console.log('Received messages:', JSON.stringify(messages, null, 2));

            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: messages,
                    model: 'llama3-70b-8192',
                    temperature: 0.7,
                    max_tokens: 200,
                    top_p: 1,
                    stream: false,
                    stop: null,
                });

                const responseContent = chatCompletion.choices[0]?.message?.content || '';

                return {
                    role: 'assistant',
                    content: responseContent,
                };
            } catch (error) {
                console.error('Error in sendMessage:', error);
                throw new UserInputError('Error generating response', {
                    invalidArgs: messages,
                });
            }
        },
    },
};

module.exports = resolvers;
