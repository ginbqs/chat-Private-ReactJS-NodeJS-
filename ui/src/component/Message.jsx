import React,{ useState, useEffect} from 'react';
import styled from "styled-components"


export default function Message({currentUser}){
    console.log(currentUser)
    return(
        <Container>
            <h3>Message.</h3>
        </Container>
    )
}

const Container = styled.div`
hight:80%;
`