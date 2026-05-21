'use client';



export default function ExtranetEmbed() {
    const iframeUrl = "https://www.gitextranet.com.ar/login?login=1&embedded=8335&user_name=RINCON&password=amircito";

    return (
        <div className="w-full h-[calc(100vh-80px)] overflow-hidden">
            <iframe 
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Mayorista Rincón TECH"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
        </div>
    );
}
