"use client"
import { Breadcrumbs } from '@mui/material';
import React from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FaHome } from 'react-icons/fa';
import { MdExpandMore } from 'react-icons/md';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const BreadCrumbs = ({pageName}) => {
    const page_name = decodeURIComponent(pageName)
    return (
        <div role="presentation" className='py-2 px-4 md:px-14'>
            <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                    className='cursor-pointer'
                    component="a"
                    href="/"
                    label="Home"
                    icon={<FaHome fontSize="small" />}
                />
                <StyledBreadcrumb component="a" href="#" label={page_name} />
            </Breadcrumbs>
        </div>
    )
}

export default BreadCrumbs
