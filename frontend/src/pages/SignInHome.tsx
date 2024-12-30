import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // 리디렉션을 위해 useNavigate 사용
import ScrollMagic from "scrollmagic";
import { gsap } from "gsap";

import "../styles/main/Home.css";
import MainButton1 from "../components/main/MainButton1";
import MainButton2 from "../components/main/MainButton2";
import RecipeCarousel from "../components/main/RecipeCarousel";

const SignInHome = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
        } else {
            // 로그인되지 않은 상태라면 /signin 페이지로 리디렉션
            navigate("/signin");
        }

        const controller = new ScrollMagic.Controller();

        const text1 = document.querySelector(".maintext1") as HTMLElement | null;
        const text2 = document.querySelector(".maintext2") as HTMLElement | null;
        const button1 = document.querySelector(
            ".maintextbox button"
        ) as HTMLElement | null;
        const fridgeImg = document.querySelector(
            ".mainfridgeimg"
        ) as HTMLElement | null;

        const text3 = document.querySelector(
            ".maincommunitytext1"
        ) as HTMLElement | null;
        const text4 = document.querySelector(
            ".maincommunitytext2"
        ) as HTMLElement | null;
        const button2 = document.querySelector(
            ".maincommunitytextbox button"
        ) as HTMLElement | null;
        const communityImg = document.querySelector(
            ".maincommunityimg"
        ) as HTMLElement | null;

        // GSAP 애니메이션 설정 (동일)
        const animateTextAndButton = (
            text1El: HTMLElement | null,
            text2El: HTMLElement | null,
            buttonEl: HTMLElement | null,
            fridgeImgEl: HTMLElement | null
        ) => {
            if (text1El && text2El && buttonEl && fridgeImgEl) {
                gsap.fromTo(
                    [text1El, text2El, buttonEl],
                    {
                        x: -250,
                        opacity: 0,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1.5,
                        ease: "power3.out",
                        stagger: 0.3,
                    }
                );

                // 프리지 이미지 애니메이션
                gsap.fromTo(
                    fridgeImgEl,
                    {
                        x: 250,
                    },
                    {
                        x: 0,
                        duration: 2,
                        ease: "power3.out",
                    }
                );
            }
        };

        const animateCommunityTextAndButton = (
            communityText1El: HTMLElement | null,
            communityText2El: HTMLElement | null,
            communityButtonEl: HTMLElement | null,
            communityImgEl: HTMLElement | null
        ) => {
            if (
                communityText1El &&
                communityText2El &&
                communityButtonEl &&
                communityImgEl
            ) {
                // 커뮤니티 이미지 애니메이션
                gsap.fromTo(
                    communityImgEl,
                    {
                        x: -250,
                    },
                    {
                        x: 0,
                        duration: 2,
                        ease: "power3.out",
                    }
                );

                gsap.fromTo(
                    [communityText1El, communityText2El, communityButtonEl],
                    {
                        x: 250,
                        opacity: 0,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: (i) => (i === 0 ? 0.5 : i === 1 ? 1 : 1.5),
                        stagger: 0.3,
                        ease: "power3.out",
                    }
                );
            }
        };

        // ScrollMagic 애니메이션
        new ScrollMagic.Scene({
            triggerElement: ".maincontainer",
            triggerHook: 0.8,
            reverse: false,
        })
            .on("enter", () => animateTextAndButton(text1, text2, button1, fridgeImg))
            .addTo(controller);

        new ScrollMagic.Scene({
            triggerElement: ".maincommunitycontainer",
            triggerHook: 0.8,
            reverse: false,
        })
            .on("enter", () =>
                animateCommunityTextAndButton(text3, text4, button2, communityImg)
            )
            .addTo(controller);

        return () => {
            controller.destroy(false);
        };
    }, [navigate]);  // navigate 추가

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        alert("You have been logged out.");
        navigate("/home");  // 로그아웃 후 홈으로 리디렉션
    };

    return (
        <div className="homebody">


            <div className="maincontainer">
                <div className="maincontextbox">
                    <div className="mainfridgeimg"></div>
                    <div className="maintextbox">
                        <div className="maintext1">flit n fill</div>
                        <div className="maintext2">
                            flit n fill 에서 <br />
                            냉장고 관리를 <br />
                            해보세요.
                        </div>

                        <MainButton1 />
                    </div>
                </div>
            </div>

            <RecipeCarousel />
            <div className="maincommunitycontainer">
                <div className="maincommunitybox">
                    <div className="maincommunityimg"></div>
                    <div className="maincommunitytextbox">
                        <div className="maincommunitytext1">
                            exchange <br />
                            food
                        </div>
                        <div className="maincommunitytext2">
                            이웃주민들과 교환
                            <br />
                            해보세요.
                        </div>
                        <MainButton2 />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInHome;