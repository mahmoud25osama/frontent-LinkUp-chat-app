import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Search, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePendingRequests } from '../hooks/useFriends'
import UserList from '../components/UserList'
import UserSearch from '../components/UserSearch'
import FriendRequests from '../components/FriendRequests'
import ChatWindow from '../components/ChatWindow'
import Logo from '../components/Logo'

const Chat = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [selectedUser, setSelectedUser] = useState(null)
    const [showMobileChat, setShowMobileChat] = useState(false)
    const [activeTab, setActiveTab] = useState('friends') // 'friends', 'search', 'requests'

    const { data: pendingRequests } = usePendingRequests()
    const pendingCount = pendingRequests?.length || 0

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleSelectUser = (user) => {
        setSelectedUser(user)
        setShowMobileChat(true)
    }

    const handleBackToList = () => {
        setShowMobileChat(false)
        setSelectedUser(null)
    }

    const renderSidebar = () => {
        switch (activeTab) {
            case 'friends':
                return (
                    <UserList
                        selectedUser={selectedUser}
                        onSelectUser={handleSelectUser}
                    />
                )
            case 'search':
                return <UserSearch />
            case 'requests':
                return <FriendRequests />
            default:
                return (
                    <UserList
                        selectedUser={selectedUser}
                        onSelectUser={handleSelectUser}
                    />
                )
        }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-primary-600 text-white px-4 py-3 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg">
                                تطبيق الدردشة
                            </h1>
                            <p className="text-xs text-primary-100">
                                {user?.username}
                            </p>
                        </div> */}
                        <Logo size="sm" showText={true} />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">تسجيل خروج</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Desktop: always visible, Mobile: hidden when chat is open */}
                <div
                    className={`w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col ${
                        showMobileChat ? 'hidden lg:flex' : 'flex'
                    }`}
                >
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition ${
                                activeTab === 'friends'
                                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">الأصدقاء</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition ${
                                activeTab === 'search'
                                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Search className="w-5 h-5" />
                            <span className="font-medium">بحث</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition relative ${
                                activeTab === 'requests'
                                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">الطلبات</span>
                            {pendingCount > 0 && (
                                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                        {renderSidebar()}
                    </div>
                </div>

                {/* Chat Window - Desktop: always visible, Mobile: only when user selected */}
                <div
                    className={`flex-1 ${
                        showMobileChat ? 'block' : 'hidden lg:block'
                    }`}
                >
                    <ChatWindow
                        selectedUser={selectedUser}
                        onBack={handleBackToList}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat
