// Icons: Lucide (https://lucide.dev/)
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
// App
import Loading from '@/components/shared/Loading';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IImage } from '@/lib/interfaces/image.interface';
import { useState, useEffect } from 'react';
// .env constants
const IMAGES_URL: string = import.meta.env.VITE_IMAGES_URL;
// Interface
interface ICarousel {
	autoSlide?: boolean;
	autoSlideInterval?: number;
	images: IImage[];
}
// React component
function Carousel(props: ICarousel) {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	const autoSlide: boolean = props.autoSlide || false;
	const autoSlideInterval: number = props.autoSlideInterval || 3000;
	const images: IImage[] = props.images;

	const [current, setCurrent] = useState<number>(0);
	const prev = () => setCurrent((current) => (current === 0 ? images.length - 1 : current - 1));
	const next = () => setCurrent((current) => (current === images.length - 1 ? 0 : current + 1));

    useEffect(() => {
		if (!autoSlide) return;
		const slideInterval = setInterval(next, autoSlideInterval);
		return () => clearInterval(slideInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<div className='flex aspect-[83/50] min-w-full'>
				{loading && (
					<div className='mx-auto flex h-auto w-auto flex-row items-center'>
						<Loading width={36} height={36} dur={0.75} color='#0ea5e9' />
					</div>
				)}
				<div className='relative overflow-hidden rounded-xl shadow-md'>
					<div className='flex transition-transform duration-500 ease-out' style={{ transform: `translateX(-${current * 100}%)` }}>
						{images.map((img, i) => (
							<img key={i} src={`${IMAGES_URL}/${img.name}`} onLoad={() => setLoading(false)} />
						))}
					</div>
					{images.length > 1 && (
						<div className='absolute inset-0 flex items-center justify-between p-4'>
							<button onClick={prev} className='rounded-full bg-white/70 p-1 text-gray-800 shadow hover:bg-white'>
								<ChevronLeft size={25} />
							</button>
							<button onClick={next} className='rounded-full bg-white/70 p-1 text-gray-800 shadow hover:bg-white'>
								<ChevronRight size={25} />
							</button>
						</div>
					)}
					<div className='absolute bottom-4 left-0 right-0'>
						<div className='flex items-center justify-center gap-2'>
							{images.map((_, i) => (
								<div key={i} className={`h-2 w-2 rounded-full bg-white transition-all ${current === i ? 'p-1.5' : 'bg-opacity-50'}`} />
							))}
						</div>
					</div>
					<div className='absolute inset-0 flex h-fit w-auto justify-end p-4'>
						<button onClick={() => setIsFullscreen(true)} className='place-items-center rounded-full bg-white/70 p-1 text-gray-800 shadow hover:bg-white/100'>
							<Expand size={25} strokeWidth={1.5} />
						</button>
					</div>
				</div>
			</div>
			<Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
				<DialogContent className='max-w-4xl border-none p-0'>
					<img className={`rounded-lg`} src={`${IMAGES_URL}/${images[current].name}`} />
				</DialogContent>
			</Dialog>
		</>
	);
}
// Export React component
export default Carousel;
