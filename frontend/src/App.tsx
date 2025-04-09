/* eslint-disable react-hooks/exhaustive-deps */
import './styles/App.scss';

// Utils
import { FC, Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { getFromLocalStorageWithExpiry } from './utils/localstorage';

// Components
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/Layout';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { authActions } from './store/slices/auth';
import { persistor, store, useAppDispatch, useAppSelector } from './store/store';

// Spotify
import WebPlayback, { WebPlaybackProps } from './utils/spotify/webPlayback';

// Pages
import SearchContainer from './pages/Search/Container';
import { playerService } from './services/player';
import { Spinner } from './components/spinner/spinner';

const Home = lazy(() => import('./pages/Home'));
const Page404 = lazy(() => import('./pages/404'));
const AlbumView = lazy(() => import('./pages/Album'));
const GenrePage = lazy(() => import('./pages/Genre'));
const BrowsePage = lazy(() => import('./pages/Browse'));
const ArtistPage = lazy(() => import('./pages/Artist'));
const PlaylistView = lazy(() => import('./pages/Playlist'));
const ArtistDiscographyPage = lazy(() => import('./pages/Discography'));

const Profile = lazy(() => import('./pages/User/Home'));
const ProfileTracks = lazy(() => import('./pages/User/Songs'));
const ProfileArtists = lazy(() => import('./pages/User/Artists'));
const ProfilePlaylists = lazy(() => import('./pages/User/Playlists'));

const SearchPage = lazy(() => import('./pages/Search/Home'));
const SearchTracks = lazy(() => import('./pages/Search/Songs'));
const LikedSongsPage = lazy(() => import('./pages/LikedSongs'));
const SearchAlbums = lazy(() => import('./pages/Search/Albums'));
const SearchPlaylist = lazy(() => import('./pages/Search/Playlists'));
const SearchPageArtists = lazy(() => import('./pages/Search/Artists'));
const RecentlySearched = lazy(() => import('./pages/Search/RecentlySearched'));

const SpotifyContainer: FC<{ children: any }> = memo(({ children }) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => !!state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const requesting = useAppSelector((state) => state.auth.requesting);

  useEffect(() => {
    const tokenInLocalStorage = getFromLocalStorageWithExpiry('access_token');
    console.log('[SpotifyContainer] Token from localStorage:', tokenInLocalStorage);
    dispatch(authActions.setToken({ token: tokenInLocalStorage }));
  }, [dispatch]);

  const webPlaybackSdkProps: WebPlaybackProps = useMemo(
    () => ({
      playerAutoConnect: true,
      playerInitialVolume: 1.0,
      playerRefreshRateMs: 1000,
      playerName: 'Spotify React Player',
      onPlayerRequestAccessToken: () => {
        console.log('[WebPlayback] Requesting access token:', token);
        return Promise.resolve(token || '');
      },
      onPlayerLoading: () => console.log('[WebPlayback] Player loading...'),
      onPlayerWaitingForDevice: () => {
        console.log('[WebPlayback] Waiting for device...');
        dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
      },
      onPlayerError: (e) => {
        console.error('[WebPlayback] Player error:', e);
      },
      onPlayerDeviceSelected: () => {
        console.log('[WebPlayback] Device selected');
        dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
      },
    }),
    [dispatch, token]
  );

  console.log('[SpotifyContainer] Render:', { user, token, requesting });
  console.log('[SpotifyContainer] Rendering children directly (bypassing auth)');
  return <>{children}</>;
});

const RoutesComponent = memo(() => {
  const location = useLocation();
  const container = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => !!state.auth.user);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = 0;
      console.log('[RoutesComponent] Scroll reset to top for location:', location.pathname);
    }
  }, [location, container]);

  const routes = useMemo(() => {
    const allRoutes = [
      { path: '', element: <Home container={container} />, public: true },
      { path: '/collection/tracks', element: <LikedSongsPage container={container} /> },
      {
        public: true,
        path: '/playlist/:playlistId',
        element: <PlaylistView container={container} />,
      },
      { path: '/album/:albumId', element: <AlbumView container={container} /> },
      {
        public: true,
        path: '/artist/:artistId/discography',
        element: <ArtistDiscographyPage container={container} />,
      },
      { public: true, path: '/artist/:artistId', element: <ArtistPage container={container} /> },
      { path: '/users/:userId/artists', element: <ProfileArtists container={container} /> },
      { path: '/users/:userId/playlists', element: <ProfilePlaylists container={container} /> },
      { path: '/users/:userId/tracks', element: <ProfileTracks container={container} /> },
      { path: '/users/:userId', element: <Profile container={container} /> },
      { public: true, path: '/genre/:genreId', element: <GenrePage /> },
      { public: true, path: '/search', element: <BrowsePage /> },
      { path: '/recent-searches', element: <RecentlySearched /> },
      {
        public: true,
        path: '/search/:search',
        element: <SearchContainer container={container} />,
        children: [
          { path: 'artists', element: <SearchPageArtists container={container} /> },
          { path: 'albums', element: <SearchAlbums container={container} /> },
          { path: 'playlists', element: <SearchPlaylist container={container} /> },
          { path: 'tracks', element: <SearchTracks container={container} /> },
          { path: '', element: <SearchPage container={container} /> },
        ],
      },
      { path: '*', element: <Page404 /> },
    ];
    const filteredRoutes = allRoutes.filter((r) => (user ? true : r.public));
    console.log('[RoutesComponent] Filtered routes:', filteredRoutes.map((r) => r.path));
    return filteredRoutes;
  }, [container, user]);

  console.log('[RoutesComponent] Rendering with location:', location.pathname);

  return (
    <div
      className="Main-section"
      ref={container}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<div>Đang tải...</div>}>
                  {(() => {
                    console.log('[RoutesComponent] Rendering route:', route.path);
                    return route.element;
                  })()}
                </Suspense>
              }
            >
              {route?.children
                ? route.children.map((child) => (
                    <Route
                      key={child.path}
                      path={child.path}
                      element={
                        <Suspense fallback={<div>Đang tải nội dung con...</div>}>
                          {(() => {
                            console.log('[RoutesComponent] Rendering child route:', child.path);
                            return child.element;
                          })()}
                        </Suspense>
                      }
                    />
                  ))
                : undefined}
            </Route>
          ))}
        </Routes>
      </div>
    </div>
  );
});

const RootComponent = () => {
  const user = useAppSelector((state) => !!state.auth.user);
  const playing = useAppSelector((state) => !state.spotify.state?.paused);

  const handleSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.target?.tagName?.toUpperCase() === 'INPUT') return;
      if (playing === undefined) return;
      e.stopPropagation();
      if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        const request = !playing ? playerService.startPlayback() : playerService.pausePlayback();
        console.log('[RootComponent] Spacebar pressed, playback:', !playing ? 'start' : 'pause');
        request.then(() => console.log('[RootComponent] Playback request successful')).catch((err) =>
          console.error('[RootComponent] Playback error:', err)
        );
      }
    },
    [playing]
  );

  useEffect(() => {
    if (!user) {
      console.log('[RootComponent] User not logged in, skipping spacebar listener');
      return;
    }
    document.addEventListener('keydown', handleSpaceBar);
    console.log('[RootComponent] Spacebar listener added');
    return () => {
      document.removeEventListener('keydown', handleSpaceBar);
      console.log('[RootComponent] Spacebar listener removed');
    };
  }, [user, handleSpaceBar]);

  useEffect(() => {
    if (!user) {
      console.log('[RootComponent] User not logged in, skipping context menu listener');
      return;
    }
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    console.log('[RootComponent] Context menu listener added');
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      console.log('[RootComponent] Context menu listener removed');
    };
  }, [user]);

  console.log('[RootComponent] Render:', { user, playing });

  return (
    <Router>
      {(() => {
        console.log('[RootComponent] Rendering AppLayout and RoutesComponent');
        return (
          <div style={{ height: '100vh', width: '100%' }}>
            <AppLayout>
              <RoutesComponent />
            </AppLayout>
          </div>
        );
      })()}
    </Router>
  );
};

function App() {
  console.log('[App] Rendering App component');
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'SpotifyMixUI' } }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {(() => {
            console.log('[App] Rendering SpotifyContainer');
            return (
              <SpotifyContainer>
                <RootComponent />
              </SpotifyContainer>
            );
          })()}
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;