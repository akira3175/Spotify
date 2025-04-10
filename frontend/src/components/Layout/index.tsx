import { memo, useEffect, useState, type FC, type ReactElement } from 'react';

// Components
import { Col, Row } from 'antd';
import { Navbar } from './components/Navbar';
import { Library } from './components/Library';
import PlayingBar from './components/PlayingBar';
import { PlayingNow } from './components/NowPlaying';
import { LanguageModal } from '../Modals/LanguageModal';
import { LibraryDrawer } from '../Drawers/LibraryDrawer';
import { PlayingNowDrawer } from '../Drawers/PlayingNowDrawer';
import { EditPlaylistModal } from '../Modals/EditPlaylistModal';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// Interfaces

// Redux
import { useAppDispatch, useAppSelector } from '../../store/store';
import { isActiveOnOtherDevice, spotifyActions } from '../../store/slices/spotify';
import { getLibraryCollapsed, isRightLayoutOpen, uiActions } from '../../store/slices/ui';
import { LoginFooter } from './components/LoginFooter';
import { LoginModal } from '../Modals/LoginModal';
import useIsMobile from '../../utils/isMobile';

export const AppLayout: FC<{ children: ReactElement }> = memo((props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => !!state.auth.user);
  const rightLayoutOpen = useAppSelector(isRightLayoutOpen);
  const libraryCollapsed = useAppSelector(getLibraryCollapsed);
  const hasState = useAppSelector((state) => !!state.spotify.state);
  const activeOnOtherDevice = useAppSelector(isActiveOnOtherDevice);

  const [isTablet, setIsTablet] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    window.onresize = () => {
      const vh = window.innerWidth;
      if (vh < 950) {
        dispatch(uiActions.collapseLibrary());
        setIsTablet(true);
      } else {
        setIsTablet(false);
      }
    };
    return () => {
      window.onresize = null;
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(spotifyActions.fetchDevices());
  }, [user, dispatch]);

  return (
    <>
      {/* Modals & Drawers */}
      <LanguageModal />
      <LibraryDrawer />
      <PlayingNowDrawer />
      <EditPlaylistModal />
      <LoginModal />

      {/* Main Component */}
      <div
        className='main-container'
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Row
          wrap
          justify='end'
          gutter={[8, 8]}
          style={{
            overflow: 'hidden',
            flex: 1, // Lấp đầy không gian còn lại
            margin: 0,
          }}
        >
          <Col span={24}>
            <Navbar />
          </Col>

          <Col
            span={24}
            style={{
              flex: 1, // Lấp đầy không gian còn lại
              maxHeight: activeOnOtherDevice ? `calc(100vh - 185px)` : undefined,
            }}
          >
            <PanelGroup direction='horizontal' autoSaveId='persistence' style={{ height: '100%' }}>
              <Panel
                id='left'
                order={1}
                className='mobile-hidden'
                minSize={isTablet ? 10 : libraryCollapsed ? 7 : 22}
                maxSize={isTablet ? 10 : libraryCollapsed ? 8 : 28}
                defaultSize={isTablet ? 10 : libraryCollapsed ? 7 : 22}
                style={{
                  borderRadius: 5,
                  minWidth: libraryCollapsed ? 85 : 280,
                  maxWidth: libraryCollapsed ? 85 : undefined,
                }}
              >
                <Library />
              </Panel>

              {!isMobile ? <PanelResizeHandle className='resize-handler' /> : null}
              <Panel id='center' order={2} style={{ borderRadius: 5, height: '100%' }}>
                {props.children}
              </Panel>

              {!isTablet && rightLayoutOpen && hasState ? (
                <PanelResizeHandle className='resize-handler' />
              ) : null}

              {rightLayoutOpen && hasState ? (
                <Panel
                  order={3}
                  minSize={23}
                  maxSize={30}
                  defaultSize={25}
                  id='details-section'
                  style={{ borderRadius: 5, height: '100%' }}
                >
                  <PlayingNow />
                </Panel>
              ) : null}
            </PanelGroup>
          </Col>
        </Row>

        <footer
          style={{
            height: user ? '90px' : 'auto', // Chiều cao cố định cho PlayingBar
            width: '100%',
          }}
        >
          {user ? <PlayingBar /> : <LoginFooter />}
        </footer>
      </div>
    </>
  );
});

AppLayout.displayName = 'AppLayout';