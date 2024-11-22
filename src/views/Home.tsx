import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { searchValueAtom, pageAtom, fetchApi } from "@/store";
/** 컴포넌트 */
import { Header, Nav, PaginationFooter } from "@/components/common";
import { ImageCard } from "@/components/home";
import { SearchBar } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { ImageDataType } from "@/types";

function HomePage() {
    const { toast } = useToast();
    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const [page, setPage] = useAtom(pageAtom);
    const [inputValue, setInputValue] = useState<string>("");
    const [images, setImages] = useState([]); // 사진 데이터를 저장할 상태
    const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    // 엔터 키가 눌렸을 때의 동작
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // 입력 필드 초기화
            setInputValue("");
            setSearchValue(inputValue);
        }
    };

    /** ---------------------------------------------------------------------------------------------------- */

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetchApi(searchValue, page);
            console.log(res.data.total_pages);
            if (res.status === 200 && res.data) {
                setImages(res.data.results);
                setTotalPages(res.data.total_pages); // 전체 페이지

                toast({
                    title: "Unsplash API 호출 성공!!",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Unsplash API 호출 실패!!",
                    description:
                        "API 호출을 위한 필수 파라미터 값을 체크해보세요!",
                });
            }
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }, [searchValue, page, toast]); // 필요한 의존성들만 포함

    useEffect(() => {
        fetchImages();
    }, [fetchImages]); // 이제 fetchImages가 변경될 때만 실행

    return (
        <div className="page">
            <div className="page__container">
                <Header />
                <Nav />
                <div className="page__container__wallpaper">
                    <img
                        src="/assets/images/wallpaper.png"
                        alt=""
                        className="bg-image"
                    />
                    <div className="search-box">
                        <h1 className="scroll-m-20 text-4xl text-white font-extrabold tracking-tight">
                            프로젝트 02: 오픈 API를 활용한 이미지 검색 사이트
                            만들기
                        </h1>
                        <div className="flex flex-col w-full mt-5 mb-2">
                            <h4 className="scroll-m-20 text-md text-white font-semibold tracking-tight">
                                인터넷 시각자료 출처입니다.
                            </h4>
                            <h4 className="scroll-m-20 text-md text-white font-semibold tracking-tight">
                                모든 지역에 있는 크리에이터들의 지원을 받습니다.
                            </h4>
                        </div>
                        {/* 검색창 컴포넌트 */}
                        <SearchBar
                            placeholder="원하는 이미지를 검색하세요."
                            onInput={handleChange}
                            value={inputValue}
                            onKeyDown={handleKeyDown} // 엔터 키 이벤트 핸들러
                        />
                    </div>
                </div>
                <div className="page__container__contents">
                    {images.map((image: ImageDataType) => {
                        return <ImageCard data={image} key={image.id} />;
                    })}
                </div>
                <footer className="page__container__footer">
                    <PaginationFooter
                        totalPages={34}
                        currentPage={page}
                        handlePage={setPage}
                    />
                </footer>
            </div>
        </div>
    );
}

export default HomePage;
