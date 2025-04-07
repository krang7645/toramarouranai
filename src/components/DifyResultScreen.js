import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PaidIcon from '@mui/icons-material/Paid';

const DifyResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difyResponse, mbtiType, zodiacSign } = location.state || {};
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    if (difyResponse && difyResponse.data && difyResponse.data.outputs && difyResponse.data.outputs.text) {
      const text = difyResponse.data.outputs.text;
      console.log('Difyレスポンステキスト:', text);

      // JSONブロックを探す
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        let jsonContent = '';
        try {
          // JSONテキストの前処理
          jsonContent = jsonMatch[1].trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // 不可視文字を削除
            .replace(/\n\s*\n/g, '\n') // 空行を削除
            .replace(/^\s+|\s+$/gm, ''); // 各行の先頭と末尾の空白を削除

          console.log('クリーニング後のJSON文字列:', jsonContent);
          const parsedData = JSON.parse(jsonContent);
          console.log('パースされたJSONデータ:', parsedData);

          if (parsedData.恋愛 && typeof parsedData.恋愛 === 'object' && parsedData.恋愛.アドバイス) {
            const flatData = {
              恋愛: parsedData.恋愛.アドバイス || '',
              仕事: parsedData.仕事?.アドバイス || '',
              健康: parsedData.健康?.アドバイス || '',
              お金: parsedData.お金?.アドバイス || ''
            };
            console.log('フォーマットされたデータ:', flatData);
            setFormattedData(flatData);
            return;
          }
        } catch (error) {
          console.error('JSONパースエラー:', error);
          console.error('パース失敗したJSON文字列:', jsonContent);
          // エラーの詳細をログに出力
          console.error('エラーの詳細:', {
            message: error.message,
            stack: error.stack,
            jsonLength: jsonContent.length,
            firstChars: jsonContent.substring(0, 100)
          });
        }
      }

      // JSONパースに失敗した場合は、テキストから抽出を試みる
      const result = {
        恋愛: '',
        仕事: '',
        健康: '',
        お金: ''
      };

      // まず【カテゴリ】形式で検索
      const patterns = [
        {
          恋愛: /【恋愛】\s*([\s\S]*?)(?=【仕事】|【健康】|【お金】|$)/i,
          仕事: /【仕事】\s*([\s\S]*?)(?=【恋愛】|【健康】|【お金】|$)/i,
          健康: /【健康】\s*([\s\S]*?)(?=【恋愛】|【仕事】|【お金】|$)/i,
          お金: /【お金】\s*([\s\S]*?)(?=【恋愛】|【仕事】|【健康】|$)/i
        },
        // 「カテゴリ：」形式も試す
        {
          恋愛: /恋愛[：:]\s*([\s\S]*?)(?=(?:仕事|健康|お金)[：:]|$)/i,
          仕事: /仕事[：:]\s*([\s\S]*?)(?=(?:恋愛|健康|お金)[：:]|$)/i,
          健康: /健康[：:]\s*([\s\S]*?)(?=(?:恋愛|仕事|お金)[：:]|$)/i,
          お金: /お金[：:]\s*([\s\S]*?)(?=(?:恋愛|仕事|健康)[：:]|$)/i
        }
      ];

      let foundAny = false;
      for (const pattern of patterns) {
        for (const category of ['恋愛', '仕事', '健康', 'お金']) {
          if (!result[category]) { // まだ見つかっていないカテゴリのみ検索
            const match = text.match(pattern[category]);
            if (match && match[1]) {
              result[category] = match[1].trim();
              foundAny = true;
            }
          }
        }
      }

      if (foundAny) {
        console.log('テキストから抽出されたデータ:', result);
        setFormattedData(result);
      } else {
        // どのパターンでも見つからない場合は、テキスト全体を恋愛アドバイスとして扱う
        setFormattedData({
          恋愛: text.trim(),
          仕事: '',
          健康: '',
          お金: ''
        });
      }
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
          <Box
            component="img"
            src="/@とら_眉ひそめ.png"
            alt="トラまろ"
            sx={{
              width: 40,
              height: 40,
              mr: 2
            }}
          />
          <Typography variant="h5">
            {mbtiType}型 × {zodiacSign}の人の取説
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
            もう一度診断する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DifyResultScreen;