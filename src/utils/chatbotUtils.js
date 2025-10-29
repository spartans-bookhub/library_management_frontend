import { libraryService } from "../services/libraryService";
import { cartService } from "../services/cartService";

const OPENAI_API_KEY = "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const prepareChatContext = async () => {
  try {
    const [allBooks, borrowedBooks, historyData, cartItems] = await Promise.all(
      [
        libraryService.getAllBooks().catch(() => []),
        libraryService.getBorrowedBooks().catch(() => []),
        libraryService.getHistory().catch(() => []),
        cartService.getCart().catch(() => []),
      ]
    );

    const context = {
      library: {
        totalBooks: allBooks.length,
        categories: [...new Set(allBooks.map((book) => book.category))].filter(
          Boolean
        ),
        featuredBooks: allBooks.slice(0, 20).map((book) => ({
          id: book.bookId,
          title: book.bookTitle,
          author: book.bookAuthor,
          category: book.category,
          rating: book.rating,
          available: book.availableCopies > 0,
          copies: book.availableCopies,
        })),
        policies: {
          borrowingPeriod: "14 days",
          finePerDay: "50 rupees per day",
          maxBooksAllowed: 5,
        },
      },
      user: {
        currentlyBorrowed: borrowedBooks.map((book) => ({
          title: book.bookTitle,
          dueDate: book.dueDate,
          status: book.transactionStatus,
          fine: book.fineAmount || 0,
        })),
        borrowHistory: historyData.slice(0, 10).map((item) => ({
          title: item.bookTitle,
          borrowDate: item.borrowDate,
          returnDate: item.returnDate,
          status: item.transactionStatus,
        })),
        cartItems: cartItems.map((item) => ({
          title: item.bookTitle,
          author: item.bookAuthor,
          category: item.category,
        })),
        stats: {
          totalBorrowed: borrowedBooks.length,
          overdue: borrowedBooks.filter((book) => book.fineAmount > 0).length,
          cartCount: cartItems.length,
        },
      },
    };

    return context;
  } catch (error) {
    console.error("Failed to prepare chat context:", error);
    return null;
  }
};

const generateSystemPrompt = (context) => {
  return `You are BookNest AI, a helpful library assistant chatbot. You have access to the current library context and user information.

Library Context:
- Total Books: ${context?.library?.totalBooks || 0}
- Available Categories: ${context?.library?.categories?.join(", ") || "None"}
- Featured Books: ${JSON.stringify(context?.library?.featuredBooks || [])}
- Library Policies: ${JSON.stringify(context?.library?.policies || {})}

User Context:
- Currently Borrowed: ${JSON.stringify(context?.user?.currentlyBorrowed || [])}
- Recent History: ${JSON.stringify(context?.user?.borrowHistory || [])}
- Cart Items: ${JSON.stringify(context?.user?.cartItems || [])}
- User Stats: ${JSON.stringify(context?.user?.stats || {})}

Guidelines:
1. Be helpful, friendly, and conversational
2. Provide book recommendations and information based on available books
3. Share library policies and procedures information
4. Show user's current status (borrowed books, cart contents, history)
5. Keep responses concise but informative
6. IMPORTANT: Only provide information - never offer to take actions like borrowing, returning, or adding books
7. If asked about specific books not in the featured list, mention they can search for them in the library system
8. Always format monetary amounts in rupees (₹)
9. Use emojis occasionally to make responses more engaging
10. For overdue books, only provide information about policies and fines - don't offer to help with returns`;
};

export const callOpenAI = async (message, chatHistory = [], context = null) => {
  try {
    const systemPrompt = generateSystemPrompt(context);

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "Sorry, I could not process your request."
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Sorry, I am currently unavailable. Please try again later.";
  }
};

export const getWelcomeMessage = (context = null) => {
  const baseMessage = `Hello! I'm BookNest AI, your library assistant. I can help you with information about:

1. Book recommendations
2. Library policies & procedures  
3. Your borrowings & returns status
4. Cart contents
5. General library questions`;

  let personalizedMessage = baseMessage;

  if (context?.user?.stats?.overdue > 0) {
    personalizedMessage += `\n\n⚠️ I notice you have ${
      context.user.stats.overdue
    } overdue book${
      context.user.stats.overdue > 1 ? "s" : ""
    }. I can provide information about return policies.`;
  } else if (context?.user?.stats?.cartCount > 0) {
    personalizedMessage += `\n\n🛒 I see you have ${
      context.user.stats.cartCount
    } book${
      context.user.stats.cartCount > 1 ? "s" : ""
    } in your cart. I can show you what's inside.`;
  }

  personalizedMessage += "\n\nWhat would you like to know?";

  return {
    sender: "ai",
    text: personalizedMessage,
    timestamp: new Date(),
  };
};

export const getQuickSuggestions = (context = null) => {
  const baseSuggestions = [
    "Recommend books for me",
    "What are the library policies?",
    "How do I return a book?",
  ];

  if (!context) return baseSuggestions;

  const suggestions = [...baseSuggestions];

  if (context.user?.stats?.totalBorrowed > 0) {
    suggestions.unshift("What books do I have?");
  }

  if (context.user?.stats?.overdue > 0) {
    suggestions.unshift("Help me with overdue books");
  }

  if (context.user?.stats?.cartCount > 0) {
    suggestions.unshift("What's in my cart?");
  }

  return suggestions.slice(0, 6);
};

export const formatChatMessage = (text, sender) => {
  return {
    sender,
    text: text.trim(),
    timestamp: new Date(),
  };
};
