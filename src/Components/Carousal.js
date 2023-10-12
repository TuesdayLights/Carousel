import "./styles.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import img1 from '../Images/001.jpg'
import img2 from '../Images/002.jpg'
import img3 from '../Images/003.jpg'
import img4 from '../Images/004.jpg'
import img5 from '../Images/005.jpg'
import img6 from '../Images/006.jpg'

export default function Caroussal() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const items = [
   img1,img2,img3,img4,img5,img6
  ];

  const mobile = [
    img1,img2,img3,img4,img5,img6
  ];

  const web = [
    img1,img2,img3,img4,img5,img6
  ];

  // we want the scope to be always to be in the scope of the array so that the carousel is endless
  const indexInArrayScope =
    ((activeIndex % items.length) + items.length) % items.length;

  // so that the carousel is endless, we need to repeat the items twice
  // then, we slice the the array so that we only have 3 items visible at the same time
  const visibleItems = [...items, ...items].slice(
    indexInArrayScope,
    indexInArrayScope + 5
  );
 
  const handleClick = (newDirection) => {
    setActiveIndex((prevIndex) => [prevIndex[0] + newDirection, newDirection]);
  };

  const getImageIndex = (item) => {
    switch (item) {
      case visibleItems[0]:
        return "left";
      case visibleItems[1]:
        return "leftCenter";
      case visibleItems[2]:
        return "center";
      case visibleItems[3]:
        return "rightCenter";
      case visibleItems[4]:
        return "right";
      default:
        return "right";
    }
  };

  const getClassName = (item) => {
    return `${getImageIndex(item)} ${mobile.includes(item) ? "mobile" : "web"}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => [prevIndex[0] + 1, 1]);
    }, 3500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="main-wrapper">
      
      <div className="wrapper">
        {/*AnimatePresence is necessary to show the items after they are deleted because only max. 3 are shown*/}
        
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((item, itemIndex) => {
            // The layout prop makes the elements change its position as soon as a new one is added
            // The key tells framer-motion that the elements changed its position
            return (
              
              <motion.div
                id={getClassName(item)}
                className={`card ${getClassName(item)}`}
                key={item}
                layout
                custom={{
                  slidePosition: getImageIndex(item),
                  isMobile: mobile.includes(item) ? true : false,
                  direction,
                  position: () => {
                    return getImageIndex(item);
                  }
                }}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 1 }}
                onClick={() => {
                  setActiveIndex([itemIndex, 0]);
                }}
              >
                <img src={item} alt="test" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="buttons">
        {/* <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => handleClick(-1)}
        >
          ◀︎
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleClick(1)}>
          ▶︎
        </motion.button> */}
      </div>
    </div>
  );
}

const variants = {
  enter: ({ direction }) => {
    return { scale: 0.2, x: direction < 1 ? 50 : -50, opacity: 0 };
    // return { scale: 0.2, x: 50, opacity: 0 };
  },
  center: ({ position, direction, slidePosition, isMobile }) => {
    return {
      // scale: position() === "center" ? 1 : 0.6,
      // zIndex: getZIndex({ position, direction }),
      // opacity: 1
      ...getCenterXPosition(slidePosition, isMobile)
    };
  },
  exit: ({ direction }) => {
    // return { scale: 0.2, x: direction < 1 ? -50 : 50, opacity: 0 };
    return { scale: 0.5, x: 0, opacity: 0 };
  }
};

const getCenterXPosition = (slidePosition, isMobile) => {
  switch (slidePosition) {
    case "left":
      return {
        x: isMobile ? 950 : 800,
        zIndex: 1,
        scale: 0.5,
        opacity: 0.7
      };
    case "right":
      return {
        x: isMobile ? -950 : -800,
        zIndex: 1,
        scale: 0.5,
        opacity: 0.7
      };
    case "leftCenter":
      return {
        x: isMobile ? 280 : 550,
        zIndex: 2,
        scale: 0.7,
        opacity: 0.8
      };
    case "rightCenter":
      return {
        x: isMobile ? -280 : -550,
        zIndex: 2,
        scale: 0.7,
        opacity: 0.8
      };
    case "center":
      return {
        x: 0,
        zIndex: 3,
        scale: 1,
        opacity: 1
      };
    default:
      return {
        x: 0,
        zIndex: 3
      };
  }
};

function getZIndex({ position, direction }) {
  const indexes = {
    left: direction > 0 ? 2 : 1,
    center: 3,
    right: direction > 0 ? 1 : 2
  };
  return indexes[position()];
}
