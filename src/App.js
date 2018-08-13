import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      favouritedImages: [],
      load: true,
      page:1,
      storage: '',
      active: false
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
    this.setState({
      storage: localStorage.getItem("storage") == null ? '' : localStorage.getItem("storage")  
    }, () => {
      this.queryStorage(this.state.storage);
    });
    this.getPhotos('1');
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

 getPhotos = (page,perPage) =>{
    window.removeEventListener('scroll', this.onScroll, false);
    const API_PAGE = page;
    const API_KEY = 'a46a979f39c49975dbdd23b378e6d3d5';
    const API_ENDPOINT = `https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${API_KEY}&extras=owner_name&format=json&nojsoncallback=1&per_page=12&page=${API_PAGE}`;
    
    fetch(API_ENDPOINT)
    .then((response) => {
      return response.json().then((json) => {
        const images = json.photos.photo.map(({farm, server, id, secret,title,owner,ownername}) => {
          return {
           imageURL: `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`,
           imageTitle: title,
           imageOwnerId: owner,
           imageOwnerName: ownername,
           imageId: id
          }
        });
        this.setState({
          images: this.state.images.concat(images)
       });
      })
    })
    window.addEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 600) && this.state.load != false
    ){
      this.setState({
        load: false,
        page: this.state.page+1
      });
      this.getPhotos(this.state.page);
    }
    this.setState({load: true});
  }

  queryStorage = (storage) =>{
      this.setState({
        favouritedImages: this.state.favouritedImages.concat(this.state.storage.split(/[;;]/))
      },() => {
        console.log(this.state.favouritedImages);
      })
  }
  
  handleClick = (itemId,storage,e) =>{
    e.preventDefault();
    document.getElementById(itemId).classList.add("favButtonActive");
    document.getElementById(itemId).innerHTML="I liked it";
    this.setState({
      storage: this.state.storage.concat(';',itemId)
    }, () => {
      localStorage.setItem("storage", this.state.storage);
    });
  }

  render() {
    const {images,storage, favouritedImages} = this.state;

    return (
        <div id="gallery" className="image-gallery">
            {images.map((image, index) => (
              <div key={image.index} className="singleImage">
                <div className="imageHover"></div>
                <div className="imageHoverContainer">
                  <div className="imageHoverTitle"><strong>{image.imageTitle}</strong></div>
                  <div className="imageHoverLine"></div>
                  <div className="imageHoverOwner">{image.imageOwnerName}</div>

                    {favouritedImages.includes(image.imageId)
                    ? 
                    <div id={image.imageId} onClick={(e) => this.handleClick(image.imageId,storage,e)} className="favButton favButtonActive"> I liked it </div>
                    :
                    <div id={image.imageId} onClick={(e) => this.handleClick(image.imageId,storage,e)} className="favButton">  Favourite </div>
                    }
                </div>
                <img  src={image.imageURL}/>
              </div>
            ))}
        </div>
    )
  }
}
export default App
