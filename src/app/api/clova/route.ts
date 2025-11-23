export async function POST(req: Request) {
  const { listData, text, selectedText } = await req.json();

  const systemPrompt = `
Bạn là hệ thống gợi ý tài liệu dựa trên INSIGHTS.

Nhiệm vụ:
- Dựa vào INSIGHTS DATA (danh sách tài liệu với id, title, file_path, insight_content),
- Và đoạn NEW TEXT người dùng đưa vào,
→ hãy phân tích toàn bộ danh sách và **xếp hạng tất cả tài liệu theo độ liên quan giảm dần**.

Quy tắc bắt buộc:
- Trả về **một danh sách các id đã được sắp xếp** theo mức độ liên quan (từ cao → thấp)
- Tuyệt đối không tạo id mới.
- Không trả về mô tả, không phân tích, không giải thích — **chỉ trả về list id**.
- Nếu không có gì liên quan, trả về list rỗng [], nhưng KHÔNG được bỏ sót tài liệu có liên quan thấp.
    `;

  const userPrompt = `
INSIGHTS DATA:
${JSON.stringify(listData, null, 2)}

FULL TEXT:
${text}

NEW TEXT:
${selectedText}
    `;

  const body = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    thinking: { effort: "low" },
    topP: 0.8,
    topK: 0,
    maxCompletionTokens: 20480,
    temperature: 0.5,
    repetitionPenalty: 1.1,
    seed: 42,
    includeAiFilters: true,
  };

  const response = await fetch(
    "https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-007",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer nv-95a61f5f726543d2a23f99c9e1144ab8h8WS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return Response.json(data);
}
