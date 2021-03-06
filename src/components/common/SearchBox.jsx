import React from 'react'
import styled from 'styled-components';

const Input = styled.input `
  /* Variables */
  ${'' /* $bgColor: #fbfbfd; */}


  border: none;
  margin-right: 15px;
  background-color: $bgColor;
  box-shadow: 0 0 5px #222;
  border-radius: 5px;
`

export const SearchBox = ({ onSearch, searchQuery }) => {
  return (
    <Input
      placeholder="Search..."
      name="query"
      value={searchQuery}
      onChange={(e) => onSearch(e.currentTarget.value)}
    />
  )
}
