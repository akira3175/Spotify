import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Category from "./pages/Category";
import Playlist from "./pages/Playlist";
import Artist from "./pages/Artist";
import UserProfile from "./pages/UserProfile";
import PurchaseHistory from "./pages/PurchaseHistory";
import CreatePlaylist from "./pages/CreatePlaylist";
import SongDetails from "./pages/SongDetails";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat";
import { MusicProvider } from "./contexts/MusicContext";
import AuthGuard from "./guards/AuthGuard";
import LikedSongsPage from './pages/LikedSongs';
import BotChatAIPopup from "@/components/ChatAIPopupBody";

const queryClient = new QueryClient();

const App = () => (
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <MusicProvider>
                        <Toaster />
                        <Sonner />
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Các route được bảo vệ bởi AuthGuard */}
                            <Route path="/category/:id" element={
                                <AuthGuard>
                                    <Category />
                                </AuthGuard>
                            } />
                            <Route path="/playlist/:id" element={
                                <AuthGuard>
                                    <Playlist />
                                </AuthGuard>
                            } />
                            <Route path="/artist/:id" element={
                                <AuthGuard>
                                    <Artist />
                                </AuthGuard>
                            } />
                            <Route path="/profile" element={
                                <AuthGuard>
                                    <UserProfile />
                                </AuthGuard>
                            } />
                            <Route path="/purchase-history" element={
                                <AuthGuard>
                                    <PurchaseHistory />
                                </AuthGuard>
                            } />
                            <Route path="/create-playlist" element={
                                <AuthGuard>
                                    <CreatePlaylist />
                                </AuthGuard>
                            } />
                            <Route path="/song/:id" element={<SongDetails />} />
                            <Route path="/friends" element={
                                <AuthGuard>
                                    <Friends />
                                </AuthGuard>
                            } />
                            <Route path="/chat/:userId" element={
                                <AuthGuard>
                                    <Chat />
                                </AuthGuard>
                            } />
                            <Route path="/liked-songs" element={<LikedSongsPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <BotChatAIPopup />
                    </MusicProvider>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    </BrowserRouter>
);

export default App;
