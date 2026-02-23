import NoticeCard from "../ui/notice-card"

export default function CommunityNoticeBoard() {
    return(
        <section  className="flex flex-col items-center max-w-3xl w-full gap-8">
            <div className="border-4 border-orange px-8 py-4 bg-purple w-full">          
                <h1>Community Notices</h1>
            </div>
            <div>
                <NoticeCard />
                <NoticeCard />
                <NoticeCard />
                <NoticeCard />

            </div>
        </section>

    )}