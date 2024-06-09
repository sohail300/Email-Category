import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from 'next/headers'

function mergeEmailsWithCategories(emails, categories) {
    const emailMap = new Map(); // Create a map for faster lookup by email id
    categories.forEach(category => emailMap.set(category.id, category));

    return emails.map(email => ({
        ...email,
        category: emailMap.get(email.id)?.category // Add category if found
    }));
}

export async function POST(req, res) {
    const headersList = headers()
    const apiKey = headersList.get('apiKey')

    const { emails } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Classify the emails ${JSON.stringify(emails)} into categories like Important: Emails that are personal or work-related and require immediate attention, Promotions: Emails related to sales, discounts, and marketing campaigns, Social: Emails from social networks, friends, and family, Marketing: Emails related to marketing, newsletters, and notifications, Spam: Unwanted or unsolicited emails, General: If none of the above are matched, use General. In the output only include the id of each email and a word from this array ["Important", "Promotions", "Social", "Marketing", "Spam", "General"]. 
    `;
    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    const categories = JSON.parse(text.replace(/```json\n?|```/g, ''));

    const mergedCategory = mergeEmailsWithCategories(emails, categories)

    console.log('Classification done!');

    return NextResponse.json({
        success: true,
        status: '200',
        categories: mergedCategory
    })
}
