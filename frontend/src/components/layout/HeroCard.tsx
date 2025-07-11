import background from '../../assets/background.png'

const HeroCard = () => {
    const cardStyle = {
        backgroundImage: `url(${background})`
    };

    return (
        <div className='flex justify-center w-full'>
            <div
                style={cardStyle}
                className="w-full h-120 bg-cover bg-center rounded-3xl shadow-lg flex flex-col justify-start items-start text-white p-6"
            >
                <p className="font-light text-2xl ml-20 drop-shadow-2xl">
                    bem vindo ao
                </p>
                <h1 className="font-bold text-8xl tracking-tighter drop-shadow-sm">
                    ONG-sys
                </h1>
            </div>
        </div>
    );
}

export default HeroCard;