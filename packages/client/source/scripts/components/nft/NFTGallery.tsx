import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Network, Alchemy } from 'alchemy-sdk';

// Types
interface NFT {
  contract: {
    address: string;
    name: string;
  };
  tokenId: string;
  title?: string;
  description?: string;
  tokenType?: string;
  media?: Array<{
    gateway: string;
    raw?: string;
    thumbnail?: string;
  }>;
  metadata?: Record<string, any>;
}

interface NFTGalleryProps {
  address: string;
}

interface NFTDetailProps {
  nft: NFT | null;
}

interface NFTMetadata {
  name: string;
  description: string;
}

// NFT Gallery Component
export const NFTGallery: React.FC<NFTGalleryProps> = ({ address }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async (): Promise<void> => {
      if (!address) return;

      setLoading(true);

      try {
        // Configure Alchemy SDK
        const settings = {
          apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
          network: Network.ETH_MAINNET,
        };

        const alchemy = new Alchemy(settings);

        // Fetch NFTs for the given address
        const nftData = await alchemy.nft.getNftsForOwner(address);
        setNfts(nftData.ownedNfts);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Failed to fetch NFTs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  if (loading) return <LoadingContainer>Loading your NFT collection...</LoadingContainer>;
  if (error) return <ErrorContainer>{error}</ErrorContainer>;
  if (nfts.length === 0) return <EmptyContainer>No NFTs found</EmptyContainer>;

  return (
    <GalleryContainer>
      <GalleryHeading>Your NFT Collection</GalleryHeading>
      <NFTGrid>
        {nfts.map((nft) => (
          <NFTCard key={`${nft.contract.address}-${nft.tokenId}`}>
            <NFTImage
              src={nft.media && nft.media[0]?.gateway ? nft.media[0].gateway : '/api/placeholder/250/250'}
              alt={nft.title || `NFT #${nft.tokenId}`}
            />
            <NFTInfo>
              <NFTTitle>{nft.title || `#${nft.tokenId}`}</NFTTitle>
              <NFTCollection>{nft.contract.name}</NFTCollection>
            </NFTInfo>
          </NFTCard>
        ))}
      </NFTGrid>
    </GalleryContainer>
  );
};

// NFT Minting Component
export const NFTMinting: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [minting, setMinting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleMetadataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const uploadToPinata = async (): Promise<string> => {
    setUploading(true);
    setError(null);

    if (!file) {
      throw new Error('No file selected');
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Pinata
      const response = await fetch('/api/nft/upload-to-pinata', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload to Pinata');

      const data: { IpfsHash: string } = await response.json();

      // Create metadata
      const metadataObject = {
        name: metadata.name,
        description: metadata.description,
        image: `ipfs://${data.IpfsHash}`,
      };

      // Upload metadata to Pinata
      const metadataResponse = await fetch('/api/nft/upload-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadataObject),
      });

      if (!metadataResponse.ok) throw new Error('Failed to upload metadata');

      const metadataResult: { IpfsHash: string } = await metadataResponse.json();
      return metadataResult.IpfsHash;

    } catch (err) {
      console.error('Error uploading to Pinata:', err);
      setError(`Failed to upload to IPFS: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const mintNFT = async (): Promise<void> => {
    if (!file || !metadata.name) {
      setError('Please provide an image and name for your NFT');
      return;
    }

    setMinting(true);
    setError(null);

    try {
      // 1. Upload to Pinata
      const metadataHash = await uploadToPinata();

      // 2. Mint NFT
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadataUri: `ipfs://${metadataHash}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mint NFT');
      }

      const mintData = await response.json();
      setSuccess(true);

    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(`Failed to mint NFT: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setMinting(false);
    }
  };

  return (
    <MintingContainer>
      <MintingHeading>Create New NFT</MintingHeading>

      <FormGroup>
        <Label>Upload Image</Label>
        <FileInput type="file" accept="image/*" onChange={handleFileChange} disabled={uploading || minting} />
        {preview && <ImagePreview src={preview} alt="Preview" />}
      </FormGroup>

      <FormGroup>
        <Label>NFT Name</Label>
        <Input
          type="text"
          name="name"
          value={metadata.name}
          onChange={handleMetadataChange}
          placeholder="Enter a name for your NFT"
          disabled={uploading || minting}
        />
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          name="description"
          value={metadata.description}
          onChange={handleMetadataChange}
          placeholder="Describe your NFT"
          disabled={uploading || minting}
        />
      </FormGroup>

      <Button onClick={mintNFT} disabled={!file || !metadata.name || uploading || minting}>
        {minting ? 'Minting...' : uploading ? 'Uploading...' : 'Create NFT'}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>NFT created successfully!</SuccessMessage>}
    </MintingContainer>
  );
};

// NFT Detail Component
export const NFTDetail: React.FC<NFTDetailProps> = ({ nft }) => {
  if (!nft) return <div>No NFT selected</div>;

  return (
    <DetailContainer>
      <DetailImage
        src={nft.media && nft.media[0]?.gateway ? nft.media[0].gateway : '/api/placeholder/500/500'}
        alt={nft.title || `NFT #${nft.tokenId}`}
      />

      <DetailInfo>
        <DetailTitle>{nft.title || `#${nft.tokenId}`}</DetailTitle>
        <DetailCollection>{nft.contract.name}</DetailCollection>

        <DetailDescription>
          {nft.description || 'No description available'}
        </DetailDescription>

        <DetailMeta>
          <MetaItem>
            <MetaLabel>Token ID</MetaLabel>
            <MetaValue>{nft.tokenId}</MetaValue>
          </MetaItem>

          <MetaItem>
            <MetaLabel>Contract</MetaLabel>
            <MetaValue>{`${nft.contract.address.substring(0, 6)}...${nft.contract.address.substring(nft.contract.address.length - 4)}`}</MetaValue>
          </MetaItem>

          <MetaItem>
            <MetaLabel>Token Standard</MetaLabel>
            <MetaValue>{nft.tokenType || 'Unknown'}</MetaValue>
          </MetaItem>
        </DetailMeta>

        <ActionButton
          onClick={() => window.open(`https://opensea.io/assets/ethereum/${nft.contract.address}/${nft.tokenId}`, '_blank')}
        >
          View on OpenSea
        </ActionButton>
      </DetailInfo>
    </DetailContainer>
  );
};

// Styled components
const GalleryContainer = styled.div`
  padding: 20px;
`;

const GalleryHeading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const NFTCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
  padding: 15px;
`;

const NFTTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 18px;
`;

const NFTCollection = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background: #fff0f0;
  border-radius: 8px;
  color: #d32f2f;
  margin: 20px 0;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

const MintingContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MintingHeading = styled.h2`
  margin-top: 0;
  margin-bottom: 30px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;

const ImagePreview = styled.img`
  margin-top: 10px;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
`;

const Button = styled.button`
  background: #6e8efb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: #5c7cfa;