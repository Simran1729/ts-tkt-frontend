import { TicketFormData } from "@shared/schema";
import { getDepartmentByName } from "./departments";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to transcribe audio");
  }

  return response.json();
}

export async function extractTicketData(text: string): Promise<TicketFormData> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract ticket information from the text and generate a concise subject line. Follow these rules carefully:

          1. Extract ALL of these fields from the input:
            - projectCode: The project's code identifier (The project Codes are mostly like this : SV2342,SV4569,SV4569,SV7634,60M40P,90A24M,100A23P etc.)
            - departmentName: Must be one of: Planning Department, Production Department, Service Department, Engineering Department
            - teamName: Must be a valid team for the mentioned department:
              * Planning Department: Planning Team
              * Production Department: Production Team 1, Production Team 2, Production Team 3
              * Service Department: Service Team
              * Engineering Department: ALUSS, Composite, Interior Engineering, Yacht Design, Interior Design, Yacht Design 3D Visuals, Deck outfitting, Electrical, Integrated Solutions, Machinery and Piping
            - severity: Must be one of: Minor, Major, Critical, Show Stopper
            - description: The description of the issue as described in the input text.

          2.Ensure that the selected **team corresponds to the department**. If a mismatch is found, correct it based on the best available match.
          3. Generate a concise subject line that summarizes the description

          4.Determine severity based on user input and yacht manufacturing context:**
            - If the user explicitly mentions severity with these values : Minor or Major or Critical or Show Stopper, use that value.
            - If severity is **not explicitly mentioned**, infer it **based on the urgency, impact, and criticality of the issue.
            - **Severity classification for yacht manufacturing:**
              * **Minor:** Minor inconvenience, documentation updates, small cosmetic issues (e.g., minor scratches, small alignment issues).
              * **Major:** Work is partially blocked, but operations can continue with adjustments (e.g., delayed material deliveries, minor electrical issues, software glitches in yacht management systems).
              * **Critical:** Major disruption, affecting production timelines or critical yacht components (e.g., hydraulic system malfunctions, navigation system bugs, delays in core manufacturing processes).
              * **Show Stopper:** Severe issues causing production shutdown, safety risks, or operational failures (e.g., structural integrity issues, engine failures, major leaks, loss of communication systems).

          Response must be a JSON object with these exact fields: projectCode, departmentName, teamName, severity, description, subject`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to extract ticket data");
  }

  const data = await response.json();
  const extractedData = JSON.parse(data.choices[0].message.content);
  console.log("This is the extracted data form the audio : ", extractedData);

  // Get department ID
  const department = getDepartmentByName(extractedData.departmentName);
  if (!department) {
    throw new Error(`Invalid department: ${extractedData.departmentName}`);
  }

  // // Validate team belongs to department
  // if (extractedData.teamName && !department.teams.includes(extractedData.teamName)) {
  //   extractedData.teamName = ""; // Clear invalid team
  // }

  return {
    ...extractedData,
    departmentName: department.id, // Replace name with ID
  };
}