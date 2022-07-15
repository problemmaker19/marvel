import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
    state = {
        list: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        end: false,
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onListLoaded)
            .catch(this.onError)
    }

    onListLoading = () => {
        this.setState({newItemLoading: true})
    }

    onListLoaded = newlist => {
        let ended = newlist.length < 9;

        this.setState(state => ({
            list: [...state.list, ...newlist],
            loading: false,
            newItemLoading: false,
            offset: state.offset + 9,
            end: ended,
        }))
    }

    onError = () => {
        this.setState({error: true, loading: false})
    }

    marvelService = new MarvelService();

    renderItems = (arr) => {
        const itemList = arr.map(({thumbnail, name, id}) => {
            const imgStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : {objectFit: 'unset'}
            return (
                <li onClick={() => this.props.onCharSelected(id)} key={id} className="char__item">
                    <img src={thumbnail} style={imgStyle} alt="char list item"/>
                    <div className="char__name">{name}</div>
                </li>
            )
        }

        )

        return (
            <ul className="char__grid">
                {itemList}
            </ul>
        )
    }



    render() {
        const {list, loading, error, newItemLoading, offset} = this.state,
              items = this.renderItems(list),
              spinner = loading ? <Spinner/> : null,
              errorRender = error ? <ErrorMessage/> : null,
              content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {spinner}
                {content}
                {errorRender}
                <button onClick={() => this.onRequest(offset)} disabled={newItemLoading} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}



export default CharList;