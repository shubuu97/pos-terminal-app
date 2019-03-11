import React from 'react';
import _get from 'lodash/get';

const withInfiniteScroll = (Component) =>
  class WithInfiniteScroll extends React.Component {
    constructor(props) {
      super(props);
      console.log('props in with infine scroll', props);
    }
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
      debugger
      var st = window.pageYOffset || document.documentElement.scrollTop;
      let lastScrollTop = this.props.lastScrollTop;
      if (st > lastScrollTop) {
        console.log('scrolling down..');
        if (
          (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
          _get(this.props, 'productsList.length', 0) > 1 && !this.props.isLoading
        ) {
          //this.props.fetchPaginatedProductList(this.props.limit, (this.props.offset + this.props.limit));
        }
      } else {
        console.log('scrolling up..');
      }
      this.props.setLastScrollTop(st);
    }

    render() {
      return <Component {...this.props
      }
      />;
    }
  }

export default withInfiniteScroll;