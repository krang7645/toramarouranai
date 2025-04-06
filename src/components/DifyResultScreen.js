import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Link, Paper, Typography, Divider } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PaidIcon from '@mui/icons-material/Paid';
import mbtiTypeDetails from '../utils/mbtiTypeDetails';
import zodiacDetails from '../utils/zodiacDetails';

const DifyResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difyResponse, mbtiType, zodiacSign, gender } = location.state || {};
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    if (difyResponse && difyResponse.data && difyResponse.data.outputs && difyResponse.data.outputs.text) {
      const text = difyResponse.data.outputs.text;
      console.log('Difyレスポンステキスト:', text);

      const result = {
        恋愛: '',
        仕事: '',
        健康: '',
        お金: ''
      };

      // テキストから各カテゴリの内容を抽出
      const patterns = [
        {
          恋愛: /【恋愛】([\s\S]*?)(?=【仕事】|【健康】|【お金】|$)/i,
          仕事: /【仕事】([\s\S]*?)(?=【恋愛】|【健康】|【お金】|$)/i,
          健康: /【健康】([\s\S]*?)(?=【恋愛】|【仕事】|【お金】|$)/i,
          お金: /【お金】([\s\S]*?)(?=【恋愛】|【仕事】|【健康】|$)/i
        }
      ];

      for (const pattern of patterns) {
        for (const category of ['恋愛', '仕事', '健康', 'お金']) {
          const match = text.match(pattern[category]);
          if (match && match[1]) {
            result[category] = match[1].trim();
          }
        }
      }

      setFormattedData(result);
    }
  }, [difyResponse]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!difyResponse || !formattedData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          データの読み込みに失敗しました。
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            戻る
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PetsIcon />
          </Avatar>
          <Typography variant="h5">
            {mbtiType}型 × {zodiacSign}の運勢
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* 恋愛 */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FavoriteIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">恋愛</Typography>
              </Box>
              <Typography>{formattedData.恋愛 || '情報がありません'}</Typography>
            </Paper>
          </Grid>

          {/* 仕事 */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">仕事</Typography>
              </Box>
              <Typography>{formattedData.仕事 || '情報がありません'}</Typography>
            </Paper>
          </Grid>

          {/* 健康 */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HealthAndSafetyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">健康</Typography>
              </Box>
              <Typography>{formattedData.健康 || '情報がありません'}</Typography>
            </Paper>
          </Grid>

          {/* お金 */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaidIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">お金</Typography>
              </Box>
              <Typography>{formattedData.お金 || '情報がありません'}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DifyResultScreen;