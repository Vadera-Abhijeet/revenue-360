import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading.json';

const Loading: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex justify-center items-center h-screen ${className}`}>
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: 200, height: 200 }}
            />
        </div>
    );
};

export default Loading; 