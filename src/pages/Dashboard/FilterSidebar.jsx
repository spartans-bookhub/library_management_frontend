import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {FormControlLabel, FormGroup} from '@mui/material';
import FormControl from '@mui/material/FormControl';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default function FilterSidebar() {
  return (
    <div>
        <h3>Filter</h3>
       <div className='bg-grey  fixed-content'>
                <div>
                    <i className="bi bi-bootstrap-fill my-2"></i>
                    <span className="brand-name fs-4">Filter-NK</span>
                </div>
                <hr className='text-dark'/>

                {/* CheckBoxes */}
                <div className="list-group list-group-flush">
                   <FormControl component="fieldset">

                    <FormGroup aria-label="position" >
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                      <FormControlLabel control={<Checkbox />} label="Required" />
                      <FormControlLabel control={<Checkbox />} label="Disabled"  value="bottom" labelPlacement="bottom"/>
                    </FormGroup>
                   </FormControl>
                </div>

                {/* Wishlist */}
                <div>
                  <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                  <Checkbox
                    {...label}
                    icon={<BookmarkBorderIcon />}
                    checkedIcon={<BookmarkIcon />}
                  />
                </div>
            </div>
    </div>
  )
}
