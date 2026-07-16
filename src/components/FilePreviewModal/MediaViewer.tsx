import styles from './FilePreviewModal.module.scss';

interface MediaViewerProps {
  blobUrl: string;
  mimeType: string;
}

export const MediaViewer = ({ blobUrl, mimeType }: MediaViewerProps): React.JSX.Element => {
  const isVideo = mimeType.startsWith('video/');

  if (isVideo) {
    return (
      <video
        className={styles['file-preview__video']}
        src={blobUrl}
        controls
        autoPlay={false}
      />
    );
  }

  return (
    <div className={styles['file-preview__audio-wrap']}>
      <audio
        className={styles['file-preview__audio']}
        src={blobUrl}
        controls
      />
    </div>
  );
};
