export default function MessagesPage() {
  const chats = [
    {
      id: 1,
      name: "Adeel Khan",
      role: "Senior Counsellor",
      last: "Please upload your SOP draft.",
      time: "10:24",
      unread: true,
    },
    {
      id: 2,
      name: "Sara Malik",
      role: "Visa Team",
      last: "Your documents look good.",
      time: "Yesterday",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-black tracking-tight mb-8">
          Messages
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Chat list */}
          <div className="rounded-2xl border border-black/10 overflow-hidden">
            <div className="bg-neutral-50 px-5 py-4 border-b border-black/10">
              <p className="font-black">Conversations</p>
            </div>

            <div className="divide-y divide-black/10">
              {chats.map((c) => (
                <ChatRow key={c.id} chat={c} />
              ))}
            </div>
          </div>

          {/* Right: Chat window */}
          <div className="md:col-span-2 rounded-2xl border border-black/10 flex flex-col">
            <div className="px-6 py-4 border-b border-black/10 bg-neutral-50">
              <p className="font-black">Adeel Khan</p>
              <p className="text-xs text-black/60">Senior Counsellor</p>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white">
              <MessageBubble from="them" text="Hello! Please upload your SOP draft." />
              <MessageBubble from="me" text="Sure, I will upload it today." />
              <MessageBubble from="them" text="Great. Let me know if you need help." />
            </div>

            <div className="border-t border-black/10 p-4 bg-white">
              <div className="flex items-center gap-3">
                <input
                  className="flex-1 rounded-full border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="Type a message..."
                />
                <button className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Send
                </button>
              </div>
              <p className="text-xs text-black/50 mt-2">
                *Chat backend later connect hoga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* components */

function ChatRow({
  chat,
}: {
  chat: {
    name: string;
    role: string;
    last: string;
    time: string;
    unread: boolean;
  };
}) {
  return (
    <div className="px-5 py-4 hover:bg-neutral-50 cursor-pointer flex items-start justify-between gap-4">
      <div>
        <p className="font-semibold">{chat.name}</p>
        <p className="text-xs text-black/60">{chat.role}</p>
        <p className="text-sm text-black/70 mt-1 truncate max-w-[200px]">
          {chat.last}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs text-black/50">{chat.time}</p>
        {chat.unread && (
          <span className="inline-block mt-1 h-2 w-2 rounded-full bg-black" />
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  from,
  text,
}: {
  from: "me" | "them";
  text: string;
}) {
  const isMe = from === "me";

  return (
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
        isMe
          ? "ml-auto bg-black text-white"
          : "mr-auto bg-neutral-100 text-black"
      }`}
    >
      {text}
    </div>
  );
}
