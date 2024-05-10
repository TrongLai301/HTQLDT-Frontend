import * as React from 'react';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Navbar() {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = (event) => {
        const drawer = document.getElementById('drawer')
        setOpen(false);
        if (!drawer.contains(event.relatedTarget)) {
            setOpenChil(prevState => {
                const newState = { ...prevState };
                Object.keys(newState).forEach(key => newState[key] = false);
                return newState;
            });
        }
    };

    const iconBook = () => {
        return (
            <svg style={{ width: '23px', height: '23px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor"
                d="M464 48c-67.61.29-117.87 9.6-154.24 25.69c-27.14 12-37.76 21.08-37.76 51.84V448c41.57-37.5 78.46-48 224-48V48ZM48 48c67.61.29 117.87 9.6 154.24 25.69c27.14 12 37.76 21.08 37.76 51.84V448c-41.57-37.5-78.46-48-224-48V48Z" /></svg>
        )
    }

    const listItems = [
        { id: 1, text: "Đào tạo", IconText: iconBook },
        { id: 2, text: "Tuyển dụng", IconText: BusinessCenterIcon, children: ["Nhu cầu", "Kế hoạch tuyển dụng", "Phỏng vấn"] },
        { id: 3, text: "Thống kê", IconText: SignalCellularAltIcon }
    ]
    const [openChil, setOpenChil] = useState({});
    const handleClick = (id) => {
        setOpenChil(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                sx={{ flexShrink: 0, '& .MuiDrawer-paper': { boxSizing: 'border-box', marginTop: '64px', backgroundColor: '#f3f3f3' } }}
                onMouseOver={handleDrawerOpen}
                onMouseOut={handleDrawerClose}
                id='drawer'
                variant="permanent" open={open}>
                <Divider />
                <List>
                    {listItems.map(({ id, text, IconText, children }) => (
                        <div key={text}>
                            <ListItem onClick={() => children && handleClick(id)} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openChil ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openChil ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconText />
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: openChil ? 1 : 0 }} />
                                    {children ? (openChil[id] ? <ExpandLess /> : <ExpandMore />) : null}
                                </ListItemButton>
                            </ListItem>
                            {children && (
                                <Collapse in={openChil[id] ?? false} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {children.map((subItem, index) => (
                                            <ListItem button key={subItem - index} sx={{ pl: 4 }}>
                                                <ListItemText primary={subItem} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </div>
                    ))}
                </List>
            </Drawer>

        </Box >
    );
}
