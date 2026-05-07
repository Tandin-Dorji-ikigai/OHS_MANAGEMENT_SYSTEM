import Sidebar from '../../components/layouts/Sidebar'
import Topbar from '../../components/layouts/Topbar'

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white">

            <Sidebar />

            <div className="lg:pl-72">
                <Topbar />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}