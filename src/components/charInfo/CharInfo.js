import './charInfo.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    marvelService = new MarvelService()

    onCharLoaded = (char) => {
        this.setState({char, loading: false, error: false})
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return
        }

        this.setState({loading: true})

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }


    render() {
        const {char, loading, error} = this.state;
        const skeleton = (char || loading || error) ? null : <Skeleton/>,
              errorRender = error ? <ErrorMessage/> : null,
              spinner = loading ? <Spinner/> : null,
              content = !(error || loading || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorRender}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char: {name, thumbnail, homepage, wiki, description, comics}}) => {
    const imgStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : {objectFit: 'unset'};
    return (
        <>
            <div className="char__basics">
                <img style={imgStyle} src={thumbnail} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length > 0 ? comics.map(({name, resourceURI}, i) => (
                        <li key={i} className="char__comics-item">
                            {name}
                        </li>
                    )).slice(10) : "empty"
                }
            </ul>
        </>
    )
}

export default CharInfo;