import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {observer} from 'mobx-react';
import React from 'react';

function AppBarView() {
	console.log('Starting the app bar');
	return (
		<div className='App'>
			<Box sx={{flexGrow: 1}}>
				<AppBar position='static' style={{background: '#4db6ac'}}>
					<Toolbar>
						<Typography
							variant='h4'
							component='div'
							sx={{flexGrow: 1, height: '5vh'}}
							align='center'>
							Order Dashboard
						</Typography>
					</Toolbar>
				</AppBar>
			</Box>
		</div>
	);
}

export default observer(AppBarView);
