import { GlobalStyle } from 'GlobalStyle';
import { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { serviceSearch } from 'services/pixabay-api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Error, Wrapper } from './App.styled';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    setIsLoading(true);
    setIsSearchDisabled(true);

    serviceSearch(query, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          setError(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        setImages(prev => [...prev, ...hits]);
        setIsLoadMore(page < Math.ceil(totalHits / 12));
        setError('');
      })
      .catch(error =>
        setError('Sorry, something went wrong. Please try again later.')
      )
      .finally(() => {
        setIsLoading(false);
        setIsSearchDisabled(false);
      });
  }, [page, query]);

  const handleSearch = obj => {
    if (obj.searchQuery.trim() === '') {
      setError('Please, enter your query');
      return;
    }

    if (obj.searchQuery.trim() === query) {
      return;
    }

    setQuery(obj.searchQuery.trim());
    setPage(1);
    setImages([]);
    setIsLoadMore(false);
    setError('');
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleOpenModal = e => {
    const currentImageId = Number(e.target.id);
    const currentItem = images.find(({ id }) => id === currentImageId);
    setCurrentItem(currentItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setIsModalOpen(false);
  };

  return (
    <Wrapper>
      <GlobalStyle />
      <Searchbar
        handleSearch={handleSearch}
        isSearchDisabled={isSearchDisabled}
      />
      {error === '' ? (
        <ImageGallery items={images} handleOpenModal={handleOpenModal} />
      ) : (
        <Error>{error}</Error>
      )}
      {isLoading && <Loader />}
      {isLoadMore && <Button onClick={handleLoadMore} />}
      {isModalOpen && <Modal item={currentItem} closeModal={closeModal} />}
    </Wrapper>
  );
};
