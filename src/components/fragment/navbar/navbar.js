import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Icon } from '@iconify/react';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import { isDisabled } from '@testing-library/user-event/dist/utils';

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

function Navbar() {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let roles = [];

    if (currentUser !== null) {
        currentUser.roles.forEach(element => {
            roles = [...roles, element.authority]
        });
    }

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

    const Book = () => {
        return (
            <Icon icon="ion:book-sharp" width="24" height="24" />
        )
    }

    const HomeIcon = () => {
        return (
            <Icon icon="fa:home" width="25" height="25" />
        )
    }

    const listItems = [
        { id: 1, text: "Trang chủ", IconText: HomeIcon, linkTo: `/`, roles: [] },
        { id: 2, text: "Đào tạo", IconText: Book, linkTo: `/training`, roles: ['ROLE_TM', 'ROLE_ADMIN'] },
        {
            id: 3, text: "Tuyển dụng", IconText: BusinessCenterIcon, roles: ['ROLE_HR'], children: [
                {
                    id: 1,
                    name: "Nhu cầu",
                    linkTo: "/recruitment/personalNeeds",
                },
                {
                    id: 2,
                    name: "Kế hoạch tuyển dụng",
                    linkTo: "/recruitment/recruitmentPlan",
                },
                {
                    id: 3,
                    name: "Quản lý ứng viên",
                    linkTo: "/recruitment/candidateManagement",
                }
            ]
        },
        {
            id: 4, text: "Thống kê", IconText: SignalCellularAltIcon, roles: ['ROLE_ADMIN'], children: [
                {
                    id: 1,
                    name: "Kết quả đào tạo",
                    linkTo: "/training/stats",
                },
                , {
                    id: 2,
                    name: "Kết quả tuyển dụng",
                    linkTo: "/recruitment/stats",
                }, {
                    id: 3,
                    name: "Thống kê sau đào tạo",
                    linkTo: "/recruitment/personalNeeds",
                },
            ]
        },
        { id: 5, text: "Người dùng", IconText: GroupIcon, linkTo: `/users`, roles: ['ROLE_ADMIN'] }
    ]

    const [openChil, setOpenChil] = useState({});
    const handleClick = (id) => {
        setOpenChil(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredListItems = listItems.filter(item => {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }
        return item.roles.some(role => roles.includes(role));
    });

    return (
        <Box
            sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{ flexShrink: 0, '& .MuiDrawer-paper': { boxSizing: 'border-box', marginTop: '64px', backgroundColor: '#f3f3f3' } }}
                onMouseOver={handleDrawerOpen}
                onMouseOut={handleDrawerClose}
                id='drawer'
                variant="permanent"
                open={open}
            >
                <Divider />
                <List>
                    {filteredListItems.map(({ id, text, IconText, children, linkTo }) => (
                        <div key={id}>
                            <div className='test'>
                                <ListItem onClick={() => children && handleClick(id)} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        component={children ? 'div' : Link}
                                        to={linkTo}
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
                            </div>
                            {children && (
                                <Collapse in={openChil[id] ?? false} timeout="auto" unmountOnExit>
                                    <List className='listChild' component="div" disablePadding>
                                        {Object.keys(children).map((subItem, index) => (
                                            <ListItem button key={subItem} sx={{ pl: 4 }}>
                                                <Link className='linkChild' to={children[subItem].linkTo}>
                                                    <ListItemText className='child' primary={children[subItem].name} />
                                                </Link>
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
export default Navbar;