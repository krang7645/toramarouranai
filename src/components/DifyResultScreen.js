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
  console.log('location全体:', location);
  console.log('location.state:', location.state);

  const { difyResponse, mbtiType, zodiacSign, birthday } = location.state || {};
  console.log('取得した値:', { difyResponse, mbtiType, zodiacSign, birthday });

  const [formattedData, setFormattedData] = useState({
    恋愛: { 特性: '', 天命: '', アドバイス: '' },
    仕事: { 特性: '', 天命: '', アドバイス: '' },
    健康: { 特性: '', 天命: '', アドバイス: '' },
    お金: { 特性: '', 天命: '', アドバイス: '' }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mbtiType || !zodiacSign || !birthday) {
      console.error('必要なデータが不足しています:', { mbtiType, zodiacSign, birthday });
      navigate('/mbti-test');
      return;
    }

    if (!difyResponse) {
      generateDescription();
    } else if (difyResponse.data && difyResponse.data.outputs && difyResponse.data.outputs.text) {
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

          // 新しいJSON形式に対応
          if (parsedData.恋愛 && typeof parsedData.恋愛 === 'object') {
            setFormattedData(parsedData);
            return;
          }
        } catch (error) {
          console.error('JSONパースエラー:', error);
          console.error('パース失敗したJSON文字列:', jsonContent);
          console.error('エラーの詳細:', {
            message: error.message,
            stack: error.stack,
            jsonLength: jsonContent.length,
            firstChars: jsonContent.substring(0, 100)
          });
        }
      }

      // JSONパースに失敗した場合は、テキストから抽出を試みる
      const defaultData = {
        恋愛: { 特性: '', 天命: '', アドバイス: '' },
        仕事: { 特性: '', 天命: '', アドバイス: '' },
        健康: { 特性: '', 天命: '', アドバイス: '' },
        お金: { 特性: '', 天命: '', アドバイス: '' }
      };

      setFormattedData(defaultData);
    }
  }, [difyResponse]);

  const handleBack = () => {
    navigate(-1);
  };

  const generateDescription = async () => {
    setIsLoading(true);
    try {
      console.log('リクエストデータ:', { mbtiType, zodiacSign, birthday });
      const requestBody = {
        workflow_id: process.env.REACT_APP_DIFY_WORKFLOW_ID,
        user: 'default',
        inputs: {
          mbti: mbtiType || '',
          zodiac: zodiacSign || '',
          birthday: birthday || '2000-01-01',
          gender: location.state?.gender || 'not_specified'
        }
      };
      console.log('送信するリクエストボディ:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_DIFY_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('APIレスポンス:', errorText);
        throw new Error(`APIエラー (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('APIレスポンスデータ:', data);

      if (data && data.answer) {
        try {
          // JSONブロックを探す
          const jsonMatch = data.answer.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            const jsonContent = jsonMatch[1].trim()
              .replace(/[\u200B-\u200D\uFEFF]/g, '') // 不可視文字を削除
              .replace(/\n\s*\n/g, '\n') // 空行を削除
              .replace(/^\s+|\s+$/gm, ''); // 各行の先頭と末尾の空白を削除

            const parsedData = JSON.parse(jsonContent);
            if (parsedData.恋愛 && typeof parsedData.恋愛 === 'object') {
              setFormattedData(parsedData);
              return;
            }
          }
        } catch (error) {
          console.error('JSON解析エラー:', error);
        }

        // JSONパースに失敗した場合は、デフォルト値を設定
        setFormattedData({
          恋愛: { 特性: '', 天命: '', アドバイス: '' },
          仕事: { 特性: '', 天命: '', アドバイス: '' },
          健康: { 特性: '', 天命: '', アドバイス: '' },
          お金: { 特性: '', 天命: '', アドバイス: '' }
        });
      }
    } catch (error) {
      console.error('APIリクエストエラー:', error);
      alert(`エラーが発生しました: ${error.message}\n\n再度お試しください。`);
    } finally {
      setIsLoading(false);
    }
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
      <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#fafafa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #e0e0e0', pb: 2 }}>
          <Box
            component="img"
            src="/toramaro_worried.png"
            alt="トラまろ"
            sx={{
              width: 60,
              height: 60,
              mr: 2
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {mbtiType}型 × {zodiacSign}の人の取説
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* 恋愛 */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #ffcdd2',
                backgroundColor: '#fff5f5'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #ffcdd2', pb: 2 }}>
                <FavoriteIcon sx={{ fontSize: 32, color: '#e53935', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>恋愛</Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・特性
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.特性 || '情報がありません'}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・天命
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.天命 || '情報がありません'}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・アドバイス
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.アドバイス || '情報がありません'}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* 仕事 */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #bbdefb',
                backgroundColor: '#f3f8ff'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #bbdefb', pb: 2 }}>
                <WorkIcon sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>仕事</Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・特性
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.特性 || '情報がありません'}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・天命
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.天命 || '情報がありません'}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・アドバイス
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.アドバイス || '情報がありません'}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* 健康 */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #c8e6c9',
                backgroundColor: '#f5fff5'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #c8e6c9', pb: 2 }}>
                <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#43a047', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#43a047' }}>健康</Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・特性
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.特性 || '情報がありません'}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・天命
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.天命 || '情報がありません'}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・アドバイス
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.アドバイス || '情報がありません'}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* お金 */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #ffe0b2',
                backgroundColor: '#fffaf0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #ffe0b2', pb: 2 }}>
                <PaidIcon sx={{ fontSize: 32, color: '#f57c00', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57c00' }}>お金</Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・特性
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.特性 || '情報がありません'}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・天命
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.天命 || '情報がありません'}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    ・アドバイス
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.アドバイス || '情報がありません'}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              fontSize: '1.1rem',
              py: 1.5,
              px: 4,
              borderRadius: 2
            }}
          >
            もう一度診断する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DifyResultScreen;