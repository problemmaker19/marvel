import './randomChar.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import shield from '../../resources/img/shield.png';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";


class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateChar();
    }


    onCharLoaded = (char) => {
         this.setState({char, loading: false, error: false})
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    marvelService = new MarvelService();

    updateChar = () => {
        this.setState({loading: true, error: false})
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }


    render() {
        const {char, loading, error} = this.state;
        const errorRender = error ? <ErrorMessage/> : null,
              spinner = loading ? <Spinner/> : null,
              content = !(error || loading) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {errorRender}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={shield} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

}

const View = ({char: {name, thumbnail, homepage, wiki, description}}) => {
    const imgStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : {objectFit: 'unset'};

    return (
        <div className="randomchar__block">
            <img src={thumbnail} style={imgStyle} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;