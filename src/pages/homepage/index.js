import { useEffect } from 'react';
import './css/index.css'

import Hero from '../../components/HomePage/hero';
import SpecialHighlights from '../../components/HomePage/SpecialHighlights';
import GetStarted from '../../components/HomePage/GetStarted';
import CreateAvtar from '../../components/UI/Cards/CreateAvtar';
import Videos from '../../components/HomePage/Videos';
import FAQ from '../../components/UI/FAQ';



function homepage(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return <>
        <Hero />
        <GetStarted />
        <SpecialHighlights />
        <CreateAvtar />
        {/* <Videos /> */}
        <FAQ />
    </>
}
export default homepage;