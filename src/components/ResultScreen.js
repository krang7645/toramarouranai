import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResultScreen = ({
  zodiacSign,
  mbtiType,
  typeDescription,
  scores,
  loading,
  onSendToDify,
  onReset,
  birthday
}) => {
  const navigate = useNavigate();

  // MBTIのディメンションを計算
  const calculateDimension = (dim1, dim2) => {
    const maxPossibleScore = 9 * 3; // 各次元3問ずつ、最大スコアは3
    const normalizedScore1 = ((scores[dim1] + maxPossibleScore) / (maxPossibleScore * 2)) * 100;
    const normalizedScore2 = ((scores[dim2] + maxPossibleScore) / (maxPossibleScore * 2)) * 100;

    const total = normalizedScore1 + normalizedScore2;
    const percentage = (normalizedScore2 / total) * 100;

    return {
      dominant: percentage >= 50 ? dim2 : dim1,
      percentage: percentage >= 50 ? percentage : 100 - percentage
    };
  };

  const dimensions = [
    calculateDimension('E', 'I'),
    calculateDimension('S', 'N'),
    calculateDimension('T', 'F'),
    calculateDimension('J', 'P')
  ];

  const handleGetDescription = async () => {
    navigate('/dify-result', {
      state: {
        difyResponse: null,
        mbtiType: mbtiType,
        zodiacSign: zodiacSign,
        birthday: birthday
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <img
            src={process.env.PUBLIC_URL + "/toramaro-mbtiresult.png"}
            alt="トラまろMBTI診断結果"
            style={{
              width: '180px',
              height: '180px',
              objectFit: 'contain',
              marginBottom: '1rem',
              display: 'block'
            }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            あなたの性格タイプは: <strong>{mbtiType}</strong>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            星座: {zodiacSign}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            {typeDescription}
          </Typography>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            トラまろに取説を作ってもらう
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            あなたのMBTIタイプと星座に基づいた、より詳細な洞察を得ることができます。
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onSendToDify}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                分析中...
              </>
            ) : (
              '作成開始'
            )}
          </Button>

          <Button
            variant="outlined"
            onClick={onReset}
            disabled={loading}
          >
            もう一度診断する
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResultScreen;