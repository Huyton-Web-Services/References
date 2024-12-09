import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import styles from "./References.module.css";

const mainDomain = 'localhost:3000';

function capitaliseWords(sentence){
    const words = sentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words.join(" ");
}

function sortDataBy (data = [], key = ''){
    return data.sort(function(a,b){
        let x = a[key].toLowerCase();
        let y = b[key].toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
    });
}

export function References({ selector='article' }){
    const [currentReferences, setCurrentReferences] = useState(null);
    const router = useRouter();
    const externalTitle = " link will open a new tab and take you off site";

    useEffect(() => {
        const linkNodes = document.querySelectorAll(selector + ' a:not(.doNotReference)');

        let seenArr = [];
        let linkElementsArr = Array
            .from(linkNodes)
            .map(element => {

                // Any home links should be returned null
                if (
                    element.href === '/' ||
                    element.href.includes(mainDomain) ||
                    element.innerHTML !== element.innerText ||
                    element.innerText === ''
                )
                    return null;

                // We've already seen the URL
                if(seenArr.includes(element.href))
                    return null;

                // Add this URL to the seen array
                seenArr.push(element.href);

                // Return the array
                return {url: element.href, title: capitaliseWords(element.innerHTML)};

            })
            .filter(Boolean); // Remove the nulls

        if (linkElementsArr.length !== 0) {
            linkElementsArr = sortDataBy(linkElementsArr, 'title');
            setCurrentReferences(linkElementsArr);
        }
    }, [router.asPath]);

    return (<>
        {currentReferences &&
        <div className={styles.references}>
            <h4>References</h4>
            <ol>
                {currentReferences.map((element, i) => (
                    <li key={i}>
                        {
                            element?.url?.includes(mainDomain) ?
                                <Link className={'reference doNotReference'} href={element.url}>{element.title}</Link>
                                :
                                <Link
                                    href={element.url}
                                    className="externalLink reference doNotReference"
                                    target="_blank"
                                    title={element.title + externalTitle }
                                    rel={"noopener noreferrer nofollow"}
                                >{element.title}</Link>
                        }
                    </li>
                ))}
            </ol>
        </div>
        }
    </>);
}
