import React, { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import ChatDrawer from "./ChatDrawer"

const Header = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)

  // Scroll helper (auto-goes to home)
  const scrollToId = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } else {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const isActive = (path: string) =>
    location.pathname === path ? "text-white" : "text-gray-300 hover:text-white"

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-700/50 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-blue-400">My</span>LeakWatch
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate("/")} className={isActive("/")}>
                Home
              </button>

              <button
                onClick={() => navigate("/breach-monitor")}
                className={isActive("/breach-monitor")}
              >
                Breach Monitor
              </button>

              <button
                onClick={() => scrollToId("imageSearch")}
                className="text-gray-300 hover:text-white"
              >
                Image Search
              </button>

              <button
                onClick={() => navigate("/stats")}
                className={isActive("/stats")}
              >
                Visual Map
              </button>

              <button
                onClick={() => navigate("/docs")}
                className={isActive("/docs")}
              >
                Docs
              </button>

              {/* About Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  About <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isAboutOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg z-40">
                    <button
                      onClick={() => {
                        scrollToId("about")
                        setIsAboutOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-600 hover:text-white"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => {
                        scrollToId("contact")
                        setIsAboutOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-600 hover:text-white"
                    >
                      Contact Us
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Chat Button */}
            <div className="hidden md:block">
              <button
                onClick={openChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Chat With AI
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-slate-700/90 rounded-md mt-2 p-2 space-y-1">
              <button onClick={() => navigate("/")} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Home
              </button>
              <button onClick={() => navigate("/breach-monitor")} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Breach Monitor
              </button>
              <button onClick={() => scrollToId("imageSearch")} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Image Search
              </button>
              <button onClick={() => navigate("/stats")} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Visual Map
              </button>
              <button onClick={() => navigate("/docs")} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Docs
              </button>
              <button
                onClick={openChat}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md mt-2"
              >
                Chat With AI
              </button>
            </div>
          )}
        </div>
      </header>

      <ChatDrawer isOpen={isChatOpen} onClose={closeChat} />
    </>
  )
}

export default Header
