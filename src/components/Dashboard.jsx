/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Moon, Sun, Home, BarChart2, FileText, Settings, MenuIcon, FilePlus, FileMinus, ChevronRight, ChevronDown } from 'lucide-react';
import Setting from './Setting';
import FormWithContact from '../form/FormWithContact';
import FormWithoutContact from '../form/FormWithoutContact';
import Donations from './Donation';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../auth/Login';

const Dashboard = () => {



    const [isDarkTheme, setIsDarkTheme] = useState(false);
    console.log("darkThem", isDarkTheme)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState('donations');
    const [expandedMenus, setExpandedMenus] = useState([]);

    const toggleExpanded = (menuId) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const menuStructure = [
        {
            id: 'donations',
            label: 'Donations',
            icon: Home
        },
        {
            id: 'input-settings',
            label: 'Input Settings',
            icon: BarChart2
        },
        {
            id: 'forms',
            label: 'Forms',
            icon: FileText,
            submenu: [
                { id: 'form-with-contact', label: 'Form with Contact Info', icon: FilePlus },
                { id: 'form-without-contact', label: 'Form without Contact Info', icon: FileMinus }
            ]
        },
        {
            id: 'outputs',
            label: 'Outputs',
            icon: FileText,
            submenu: [
                { id: 'all', label: 'All', icon: FileText },
                { id: 'donations-output', label: 'Donations', icon: FilePlus },
                { id: 'photo-gallery', label: 'Photo Gallery', icon: FileMinus },
                { id: 'stats', label: 'Stats', icon: FileText }
            ]
        },
        {
            id: 'misc',
            label: 'Misc.',
            icon: Settings,
            submenu: [
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'logs', label: 'Logs', icon: FileText }
            ]
        }
    ];

    const getContent = () => {
        switch (activeMenuItem) {
            case 'donations': return <Donations />;

            case 'input-settings': return "InputSettings ";
            case 'form-with-contact': return <FormWithContact />;
            case 'form-without-contact': return <FormWithoutContact />;
            case 'donations-output': return "DonationsOutput ";
            case 'all': return "All";
            case 'photo-gallery': return "PhotoGallery ";
            case 'stats': return "Stats ";
            case 'settings': return <Setting />;
            case 'logs': return "Logs";
            default: return <div className="content-section"><h2>Welcome</h2></div>;
        }
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
        document.body.classList.toggle('dark-theme');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout()
    }

    if (!user?.isLoggedIn) return <LoginForm />;



    return (
        <div className={`dashboard ${isDarkTheme ? 'dark-theme' : ''}`}>
            <nav className="navbar">
                <button className="menu-button" onClick={toggleSidebar}><MenuIcon /></button>

                {user.isLoggedIn && (
                    <>
                        [{user.email}]
                        <button className="menu-button" onClick={handleLogout}>Logout</button>
                    </>
                )}
                <button className="theme-toggle" onClick={toggleTheme}>
                    {isDarkTheme ? <Sun size={24} /> : <Moon size={24} />}
                </button>

            </nav>

            <div className="main-container">
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-content">
                        <h2>Super ticker</h2>
                        <nav className="sidebar-nav">
                            {menuStructure.map((item) => {
                                const Icon = item.icon;
                                const ArrowIcon = expandedMenus.includes(item.id) ? ChevronDown : ChevronRight;
                                return (
                                    <div key={item.id} className="nav-item">
                                        <a
                                            href="#"
                                            className={`nav-link ${activeMenuItem === item.id ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (item.submenu) {
                                                    toggleExpanded(item.id);
                                                } else {
                                                    setActiveMenuItem(item.id);
                                                }
                                            }}
                                        >
                                            {Icon && <Icon size={20} />}
                                            <div className='submenu_setting'>

                                                <span>{item.label}</span>
                                                {item.submenu && (
                                                    <ArrowIcon
                                                        size={16}
                                                        className={`submenu-arrow ${expandedMenus.includes(item.id) ? 'rotated' : ''}`}
                                                    />
                                                )}
                                            </div>
                                        </a>
                                        {item.submenu && expandedMenus.includes(item.id) && (
                                            <div className="submenu">
                                                {item.submenu.map((subItem) => {
                                                    const SubIcon = subItem.icon;
                                                    return (
                                                        <a
                                                            key={subItem.id}
                                                            href="#"
                                                            className={`nav-link submenu-link ${activeMenuItem === subItem.id ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setActiveMenuItem(subItem.id);
                                                            }}
                                                        >
                                                            {SubIcon && <SubIcon size={16} />}
                                                            <span>{subItem.label}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    {getContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
