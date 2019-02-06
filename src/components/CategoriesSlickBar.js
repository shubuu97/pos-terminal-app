import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { categoryData } from '../constants/categoryData';
import _get from 'lodash/get'



export default class CategoriesSlickBar extends Component {
    state = {
        display: true,
        width: 800,
        showSubCategorySlider: false,
        subCategoryData: [],
        level: 1
    };
    handleCategoryClick = (categoryData, level) => { //level is length of categorization (0 for first category)
        
        this.props.onCategoryChange(categoryData);
        let subCategoryData = categoryData.categories.map((categoryData, index) =>
            <div key={index}  onClick={() => this.handleCategoryClick(categoryData, level + 1)}>
                <h3>{categoryData.categoryName}</h3>
            </div>)
        if (level == this.state.subCategoryData.length) {
            if (subCategoryData.length > 0)
                this.state.subCategoryData.push(subCategoryData)
            this.setState({ subCategoryData: this.state.subCategoryData, showSubCategorySlider: true })
        }
        else {
            let numberOfTimesToPop = this.state.subCategoryData.length - level;
            let i = 0;
            while (i != numberOfTimesToPop) {
                this.state.subCategoryData.pop();
                i++;
            }
            this.state.subCategoryData.push(subCategoryData)
            this.setState({ subCategoryData: this.state.subCategoryData })
        }
    }
    render() {
        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4
        };
        let categoryMapping = _get(this.props,'categoryData',[]).map((categoryData, index) =>
            <div key={index} onClick={
                () => this.handleCategoryClick(categoryData, 0)}

            ><h3>{categoryData.categoryName}</h3>
            </div>
        )
        return (
            <div className="react-slick-parent">
                <div
                    style={{
                        width: '80%',
                        display: this.state.display ? "block" : "none",
                        margin: '0 auto'
                    }}
                >
                    <Slider {...settings}
                    className='mayuk'>
                        {categoryMapping}
                    </Slider>
                    {
                        this.state.showSubCategorySlider ?

                            <div> {this.state.subCategoryData.map((subCategoryDataData, index) => <Slider key={index} {...settings}>
                                {subCategoryDataData}
                            </Slider>)}
                            </div>

                            : null
                    }
                </div>

            </div>
        );
    }
}