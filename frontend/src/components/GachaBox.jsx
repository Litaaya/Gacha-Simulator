import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';

const initialBanners = [
  {
    image: '/banners/can_banner.png',
    character: 'can.png',
    exclude: ['jingyuan.png', 'yasuo.png'],
    title: 'Cái bình?',
    description: 'Tỉ Lệ Cầu Nguyện Tăng!',
    detail: 'Mỗi khi cầu nguyện 10 lần chắc chắn sẽ nhận được cái gì đó',
    additional: 'Chỉ có thể nhận được các nhân vật limited của mỗi banner sự kiện cầu nguyện đã được chỉ định. Xem chi tiết để biết thêm.'
  },
  {
    image: '/banners/jingyuan_banner.png',
    character: 'jingyuan.png',
    exclude: ['can.png', 'yasuo.png'],
    title: 'Ngài',
    description: 'Tỉ Lệ Cầu Nguyện Tăng!',
    detail: 'Mỗi khi cầu nguyện 10 lần chắc chắn sẽ nhận được cái gì đó',
    additional: 'Chỉ có thể nhận được các nhân vật limited của mỗi banner sự kiện cầu nguyện đã được chỉ định. Xem chi tiết để biết thêm.'
  },
  {
    image: '/banners/yasuo_banner.png',
    character: 'yasuo.png',
    exclude: ['can.png', 'jingyuan.png'],
    title: 'Hasameo',
    description: 'Tỉ Lệ Cầu Nguyện Tăng!',
    detail: 'Mỗi khi cầu nguyện 10 lần chắc chắn sẽ nhận được cái gì đó',
    additional: 'Chỉ có thể nhận được các nhân vật limited của mỗi banner sự kiện cầu nguyện đã được chỉ định. Xem chi tiết để biết thêm.'
  }
];

const items = [
  { name: "callmeyourdaddy", image: "callmeyourdaddy.png" },
  { name: "can", image: "can.png" },
  { name: "fishmeo", image: "fishmeo.png" },
  { name: "ganyu", image: "ganyu.png" },
  { name: "huhuhu", image: "huhuhu.png" },
  { name: "indomie", image: "indomie.png" },
  { name: "jingyuan", image: "jingyuan.png" },
  { name: "meo7", image: "meo7.png" },
  { name: "realmeo", image: "realmeo.png" },
  { name: "spidermeo", image: "spidermeo.png" },
  { name: "supermeo", image: "supermeo.png" },
  { name: "tankmeo", image: "tankmeo.png" },
  { name: "tomeo", image: "tomeo.png" },
  { name: "yasuo", image: "yasuo.png" },
  { name: "you", image: "you.png" }
];

const GachaBox = () => {
  const [result, setResult] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(1);
  const [banners, setBanners] = useState(initialBanners);
  const [showResult, setShowResult] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const [showBagModal, setShowBagModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bag, setBag] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        console.log('Fetched items:', response.data);
        setBag(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  const handleGacha = async (count) => {
    const randomItems = [];
    const { character, exclude } = banners[currentBanner];
    const allowedItems = items.filter(item => !exclude.includes(item.image) && item.image !== character);
    let hasSpecialCharacter = false;
    let newBag = [...bag];

    for (let i = 0; i < count; i++) {
      const isSpecialCharacter = Math.random() < 0.1; // 10% chance
      let rolledItem;
      if (isSpecialCharacter) {
        rolledItem = items.find(item => item.image === character);
        if (rolledItem) {
          hasSpecialCharacter = true;
        }
      } else {
        rolledItem = allowedItems[Math.floor(Math.random() * allowedItems.length)];
      }

      if (rolledItem) {
        randomItems.push(rolledItem);
        const itemIndex = newBag.findIndex(item => item.name === rolledItem.name);
        if (itemIndex !== -1) {
          newBag[itemIndex].count += 1;
        } else {
          newBag.push({ ...rolledItem, count: 1 });
        }
      }
    }

    setBag(newBag);
    setResult(randomItems);
    setVideoSrc(hasSpecialCharacter ? '/video2.mp4' : '/video1.mp4');
    setShowVideo(true);

    try {
      await axios.post('http://localhost:5000/items', { items: newBag });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult([]);
  };

  const handleBannerClick = (index) => {
    if (index !== currentBanner) {
      const newBanners = [...banners];
      [newBanners[1], newBanners[index]] = [newBanners[index], newBanners[1]];
      setBanners(newBanners);
      setCurrentBanner(1);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowResult(true);
  };

  const handleSkipVideo = () => {
    setShowVideo(false);
    setShowResult(true);
  };

  const handleBagModal = () => {
    setShowBagModal(true);
  };

  const handleDetailModal = () => {
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowBagModal(false);
    setShowDetailModal(false);
  };

  const handleResetBag = async () => {
    try {
      await axios.post('http://localhost:5000/reset-items');
      const response = await axios.get('http://localhost:5000/items');
      console.log('Reset items:', response.data);
      setBag(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("/bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
    position: 'relative'
  };

  const buttonStyle = {
    width: '250px',
    height: '80px',
    backgroundImage: 'url("/wish-button.png")',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '10px',
    transition: 'transform 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent'
  };

  const textStyle = {
    zIndex: 1,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#5f3a22',
    margin: '0',
    padding: '0'
  };

  const subTextStyle = {
    zIndex: 1,
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#5f3a22',
    margin: '0',
    padding: '0'
  };

  const bagModalContent = (
    <div className="modal-content">
      <h2>Túi đồ</h2>
      <div className="bag-items">
        {bag.map((item, index) => (
          <div key={index} className="bag-item">
            <img src={`/characters/${item.image}`} alt={item.name} />
            <div>{item.name} x {item.count}</div>
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={handleResetBag}>Reset</button>
      <button className="close-button" onClick={handleCloseModal}>Close</button>
    </div>
  );

  const detailModalContent = (
    <div className="modal-content">
      <h2>Chi Tiết Cầu Nguyện</h2>
      <div className="detail-items">
        {items.map((item, index) => (
          <div key={index} className="detail-item">
            {item.name} - {item.image === banners[currentBanner].character ? '0.05%' : (99.95 / (items.length - 1)).toFixed(2) + '%'}
          </div>
        ))}
      </div>
      <button className="close-button" onClick={handleCloseModal}>Close</button>
    </div>
  );

  return (
    <div style={backgroundStyle}>
      <div className="banner-container">
        {banners.map((banner, index) => (
          <div key={index} className={`banner-wrapper ${index === 1 ? 'center' : 'side'}`} onClick={() => handleBannerClick(index)}>
            <img
              src={banner.image}
              alt={`Banner ${index}`}
              className={`banner ${index === 1 ? 'center' : 'side'}`}
            />
            {index === 1 && (
              <div className="banner-text">
                <h2>{banner.title}</h2>
                <p>{banner.description}</p>
                <br />
                <p>{banner.detail}</p>
                <br />
                <p>{banner.additional}</p>
                <br />
                <button className="detail-button" onClick={handleDetailModal}>Thông Tin Chi Tiết</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => handleGacha(1)}
        >
          <p style={textStyle}>Cầu Nguyện ×1</p>
          <p style={subTextStyle}>× 1</p>
        </button>
        <button
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => handleGacha(10)}
        >
          <p style={textStyle}>Cầu Nguyện ×10</p>
          <p style={subTextStyle}>× 10</p>
        </button>
      </div>
      <button className="bag-button" onClick={handleBagModal}>Túi đồ</button>
      {showVideo && (
        <div className="video-overlay">
          <video src={videoSrc} autoPlay onEnded={handleVideoEnd} className="fullscreen-video">
            Your browser does not support the video tag.
          </video>
          <button className="skip-button" onClick={handleSkipVideo}>Skip</button>
        </div>
      )}
      {showResult && (
        <div className="result-overlay">
          <div className="result">
            {result.map((item, index) => (
              <div key={index} className={`result-item ${item.image === banners[currentBanner].character ? 'limited' : ''}`}>
                <img src={`/characters/${item.image}`} alt={item.name} />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
          <button className="close-button" onClick={handleCloseResult}>Close</button>
        </div>
      )}
      {showBagModal && (
        <div className="modal-overlay">
          {bagModalContent}
        </div>
      )}
      {showDetailModal && (
        <div className="modal-overlay">
          {detailModalContent}
        </div>
      )}
    </div>
  );
};

export default GachaBox;