import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const TOKEN_PATH = path.join(process.cwd(), 'src/lib/token.json');
console.log(TOKEN_PATH)

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const content = await fs.readFile(TOKEN_PATH);
const key = JSON.parse(content);

const tokens = {
  access_token: key.access_token,
  refresh_token: key.refresh_token,
  scope: 'https://www.googleapis.com/auth/gmail.readonly',
  token_type: 'Bearer',
  expiry_date: Date.now() + 43200 * 1000,
};

oAuth2Client.setCredentials(tokens);

export async function GET(req, res) {
  const session = await getServerSession(authOptions)

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
    });

    const emails = await Promise.all(
      response.data.messages.map(async (msg) => {
        const emailResponse = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });

        // Extract headers
        const headers = emailResponse.data.payload.headers;
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');

        let body = '';
        if (emailResponse.data.payload.parts) {
          emailResponse.data.payload.parts.forEach(part => {
            if (part.mimeType === 'text/plain') {
              body = part.body.data;
            }
          });
        } else {
          body = emailResponse.data.payload.body.data;
        }


        // Extract sender's name from 'From' header
        let sender = '(No Sender)';
        if (fromHeader) {
          const fromValue = fromHeader.value;
          const match = fromValue.match(/(.*) <.*>/);
          sender = match ? match[1] : fromValue;
        }

        return {
          id: msg.id,
          subject: subjectHeader ? subjectHeader.value : '(No Subject)',
          snippet: emailResponse.data.snippet,
          from: sender,
          body: body ? Buffer.from(body, 'base64').toString('utf-8') : '(No Body)',
        };
      })
    );

    console.log('Classification done!');
    return NextResponse.json({ success: true, status: '200', emails })
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, status: '500' })
  }
}
