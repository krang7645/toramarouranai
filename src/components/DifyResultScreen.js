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
  const [rawData, setRawData] = useState(null);
  const [dataStructureLog, setDataStructureLog] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [formattedData, setFormattedData] = useState(null);

  // テキストからカテゴリごとのデータを抽出 (useCallbackでメモ化)
  const extractDataFromText = useCallback((text) => {
    if (!text) {
      console.log("extractDataFromText: 入力テキストがありません");
      return null;
    }
    console.log("extractDataFromText: テキスト抽出開始", text.substring(0, 100));

    const result = {
      恋愛: '',
      仕事: '',
      健康: '',
      お金: ''
    };

    // 可能な区切りパターン
    const patterns = [
      {
        恋愛: /【恋愛】([\s\S]*?)(?=【仕事】|【健康】|【お金】|$)/i,
        仕事: /【仕事】([\s\S]*?)(?=【恋愛】|【健康】|【お金】|$)/i,
        健康: /【健康】([\s\S]*?)(?=【恋愛】|【仕事】|【お金】|$)/i,
        お金: /【お金】([\s\S]*?)(?=【恋愛】|【仕事】|【健康】|$)/i
      },
      {
        恋愛: /恋愛[:：]([\s\S]*?)(?=仕事[:：]|健康[:：]|お金[:：]|$)/i,
        仕事: /仕事[:：]([\s\S]*?)(?=恋愛[:：]|健康[:：]|お金[:：]|$)/i,
        健康: /健康[:：]([\s\S]*?)(?=恋愛[:：]|仕事[:：]|お金[:：]|$)/i,
        お金: /お金[:：]([\s\S]*?)(?=恋愛[:：]|仕事[:：]|健康[:：]|$)/i
      },
      {
        恋愛: /恋愛について([\s\S]*?)(?=仕事について|健康について|お金について|$)/i,
        仕事: /仕事について([\s\S]*?)(?=恋愛について|健康について|お金について|$)/i,
        健康: /健康について([\s\S]*?)(?=恋愛について|仕事について|お金について|$)/i,
        お金: /お金について([\s\S]*?)(?=恋愛について|仕事について|健康について|$)/i
      }
    ];

    let foundAny = false;

    // それぞれのパターンで抽出を試みる
    for (const pattern of patterns) {
      for (const category of ['恋愛', '仕事', '健康', 'お金']) {
        const match = text.match(pattern[category]);
        if (match && match[1] && match[1].trim()) {
          console.log(`extractDataFromText: ${category} カテゴリをパターンで検出`);
          result[category] = match[1].trim();
          foundAny = true;
        }
      }

      // いずれかのパターンでコンテンツが見つかったら終了
      if (foundAny) {
        console.log("extractDataFromText: カテゴリパターンが見つかりました");
        break;
      }
    }

    // パターンでの検出に失敗した場合
    if (!foundAny) {
      console.log("extractDataFromText: カテゴリパターンが見つかりませんでした。フォールバック処理なし。");
      // 以前はJSONブロック前のテキストを「恋愛」に入れていたが、ここでは空にする
      // または、エラーを示すために null を返すことも検討できる
      return { 恋愛: '', 仕事: '', 健康: '', お金: '' };
    }

    return result;
  }, []);

  // レスポンスデータを整形 (useCallbackでメモ化)
  const formatResponseData = useCallback((response) => {
    try {
      if (!response) return null;

      let targetText = '';
      let potentialJson = null;
      let logEntries = [];

      // 1. 最優先: Workflowsのネストされた応答 (task_id/data/outputs/text)
      if (response.task_id && response.data && response.data.outputs && response.data.outputs.text) {
        targetText = response.data.outputs.text;
        logEntries.push('Workflows Nested Response (outputs.text) を検出');
        const jsonMatch = targetText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          let jsonContent = jsonMatch[1].trim(); // 前後の空白を削除
          logEntries.push(`抽出JSON (trim後) 先頭文字コード: ${jsonContent.charCodeAt(0)}`);

          // BOM (Byte Order Mark) U+FEFF やその他の非表示文字を除去
          if (jsonContent.charCodeAt(0) === 0xFEFF) {
             jsonContent = jsonContent.substring(1);
             logEntries.push('先頭のBOMを除去しました');
          }
          // ★★★ 再修正: JSON.parse 直前での最終整形 ★★★
          try {
            // 1. 文字列全体の先頭・末尾の空白を念のため再除去
            jsonContent = jsonContent.trim();

            // 2. JSONの整形処理を強化
            // 改行とインデントを除去して1行に整形
            jsonContent = jsonContent.replace(/\s*\n\s*/g, '');

            // 3. プロパティ名とコロンの間の空白を正規化
            jsonContent = jsonContent.replace(/"\s*:\s*/g, '":');

            // 4. 値と次のプロパティの間の空白を正規化
            jsonContent = jsonContent.replace(/},\s*"/g, '},"');

            // 5. オブジェクト開始・終了の空白を正規化
            jsonContent = jsonContent.replace(/{\s+/g, '{').replace(/\s+}/g, '}');

            logEntries.push(`抽出JSON (parse直前整形後): ${jsonContent.substring(0, 100)}...`);

            // JSON文字列をパース
            potentialJson = JSON.parse(jsonContent);
            logEntries.push('直接JSONパース成功');

            // 新しい構造か古い構造かを判定
            if (potentialJson.恋愛 && typeof potentialJson.恋愛 === 'object' && potentialJson.恋愛.アドバイス !== undefined) {
              logEntries.push('新しいネスト構造のJSONを検出・整形します。');
              const flatData = {};
              for (const category in potentialJson) {
                if (potentialJson[category] && potentialJson[category].アドバイス) {
                  flatData[category] = potentialJson[category].アドバイス;
                }
              }
              const finalData = { 恋愛: '', 仕事: '', 健康: '', お金: '', ...flatData };
              setDataStructureLog(prev => [...prev, ...logEntries]);
              return finalData;
            } else if (potentialJson.恋愛 && typeof potentialJson.恋愛 === 'string') {
              // 古いフラット構造の場合: そのまま使う
              logEntries.push('古いフラット構造のJSONを検出しました。');
               // 必須カテゴリが存在しない場合に備えてデフォルト値で補完
              const finalData = { 恋愛: '', 仕事: '', 健康: '', お金: '', ...potentialJson };
              setDataStructureLog(prev => [...prev, ...logEntries]);
              return finalData; // ★★★ 元のフラットデータを返す ★★★
            } else {
              // 予期しないJSON構造の場合
              logEntries.push('JSON構造が予期しない形式です。テキスト抽出へフォールバックします。');
              potentialJson = null; // パース失敗扱いにする
            }

          } catch (parseError) {
            logEntries.push(`直接JSONパース失敗 (parse直前整形後): ${parseError.message}`);
            logEntries.push(`エラーが発生したJSONコンテンツ (parse直前整形後): ${jsonContent}`);
            potentialJson = null; // パース失敗として扱い、フォールバックへ
          }
        }
      }
      // 2. 次点: Workflowsの応答 (outputs/text)
      else if (response.outputs && response.outputs.text) {
        targetText = response.outputs.text;
        logEntries.push('Workflows Response (outputs.text) を検出');
        const jsonMatch = targetText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          let jsonContent = jsonMatch[1].trim(); // 前後の空白を削除
          logEntries.push(`抽出JSON (trim後) 先頭文字コード: ${jsonContent.charCodeAt(0)}`);

          // BOM (Byte Order Mark) U+FEFF やその他の非表示文字を除去
          if (jsonContent.charCodeAt(0) === 0xFEFF) {
             jsonContent = jsonContent.substring(1);
             logEntries.push('先頭のBOMを除去しました');
          }
          // ★★★ 再修正: JSON.parse 直前での最終整形 ★★★
          try {
            jsonContent = jsonContent.trim(); // 先頭・末尾空白除去

            // JSONの整形処理を強化
            // 改行とインデントを除去して1行に整形
            jsonContent = jsonContent.replace(/\s*\n\s*/g, '');

            // キーと値の間の余分な空白を正規化
            jsonContent = jsonContent.replace(/"\s*:\s*/g, '":');

            // 値と次のキーの間の余分な空白を正規化
            jsonContent = jsonContent.replace(/",\s+"/g, '","');

            logEntries.push(`抽出JSON (parse直前整形後, outputs.text): ${jsonContent.substring(0, 100)}...`);

            potentialJson = JSON.parse(jsonContent); // 直接パース
            logEntries.push('直接JSONパース成功 (outputs.text)');

            // 新しい構造か古い構造かを判定
            if (potentialJson.恋愛 && typeof potentialJson.恋愛 === 'object' && potentialJson.恋愛.アドバイス !== undefined) {
              logEntries.push('新しいネスト構造のJSONを検出・整形します (outputs.text)。');
              const flatData = {};
              for (const category in potentialJson) {
                if (potentialJson[category] && potentialJson[category].アドバイス) {
                  flatData[category] = potentialJson[category].アドバイス;
                }
              }
              const finalData = { 恋愛: '', 仕事: '', 健康: '', お金: '', ...flatData };
              setDataStructureLog(prev => [...prev, ...logEntries]);
              return finalData;
            } else if (potentialJson.恋愛 && typeof potentialJson.恋愛 === 'string') {
               logEntries.push('古いフラット構造のJSONを検出しました (outputs.text)。');
               const finalData = { 恋愛: '', 仕事: '', 健康: '', お金: '', ...potentialJson };
               setDataStructureLog(prev => [...prev, ...logEntries]);
               return finalData;
            } else {
                logEntries.push('JSON構造が予期しない形式です (outputs.text)。テキスト抽出へフォールバックします。');
                potentialJson = null;
            }

          } catch (parseError) {
              logEntries.push(`直接JSONパース失敗 (parse直前整形後, outputs.text): ${parseError.message}`);
              logEntries.push(`エラーが発生したJSONコンテンツ (parse直前整形後, outputs.text): ${jsonContent}`);
              potentialJson = null;
          }
        }
      }
      // 3. 通常のAPI応答 (answer or text)
      else if (response.answer) {
        targetText = response.answer;
        logEntries.push('Answerフィールドを検出');
      } else if (response.text) {
        targetText = response.text;
        logEntries.push('Textフィールドを検出');
      }
      // 4. 直接的なオブジェクトの場合
      else if (typeof response === 'object' && (response.恋愛 || response.仕事 || response.健康 || response.お金)) {
        logEntries.push('直接的なカテゴリデータを持つオブジェクトを検出');
        setDataStructureLog(prev => [...prev, ...logEntries]);
        return response; // そのまま返す
      }
      // 5. その他のオブジェクトや文字列
      else if (typeof response === 'object') {
        targetText = JSON.stringify(response);
        logEntries.push('その他のオブジェクトを文字列化');
      } else if (typeof response === 'string') {
        targetText = response;
        logEntries.push('文字列レスポンスを検出');
      }

      // JSONが解析できなかった場合、またはテキストのみの場合、テキストから抽出
      if (targetText) {
        logEntries.push('テキストからのカテゴリ抽出を試行');
        setDataStructureLog(prev => [...prev, ...logEntries]); // 抽出前にログを更新
        return extractDataFromText(targetText);
      }

      logEntries.push('有効なデータ形式が見つかりませんでした');
      setDataStructureLog(prev => [...prev, ...logEntries]);
      return null; // 何も処理できなかった場合

    } catch (e) {
      console.error('データ整形中にエラー:', e);
      setDataStructureLog(prev => [...prev, `データ整形中にエラー: ${e.message}`]);
      return null;
    }
  }, [extractDataFromText]); // extractDataFromTextを依存配列に追加

  // レスポンスデータの処理 useEffect
  useEffect(() => {
    console.log('DifyResultScreenに渡されたデータ:', difyResponse);
    console.log('データタイプ:', typeof difyResponse);
    if (difyResponse) {
      console.log('データキー:', Object.keys(difyResponse));
      setRawData(difyResponse);

      // データ構造を把握するためのログ情報の収集
      const initialLogEntries = [];
      initialLogEntries.push(`データタイプ: ${typeof difyResponse}`);
      initialLogEntries.push(`トップレベルキー: ${Object.keys(difyResponse).join(', ')}`);

      // ログ情報を初期化
      setDataStructureLog(initialLogEntries);

      // データ整形の実行
      const formatted = formatResponseData(difyResponse);
      console.log('最終的に整形されたデータ:', formatted);
      setFormattedData(formatted);
    }
  }, [difyResponse, formatResponseData]); // formatResponseDataを依存配列に追加

  // プロフィール表示
  const getProfileInfo = () => {
    const mbtiInfo = mbtiTypeDetails[mbtiType] || { name: mbtiType, description: '' };
    const zodiacInfo = zodiacDetails[zodiacSign] || { name: zodiacSign, description: '' };

    return (
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="body1" gutterBottom>
          <strong>MBTI: </strong>{mbtiInfo.name} - {mbtiInfo.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>星座: </strong>{zodiacInfo.name} - {zodiacInfo.description}
        </Typography>
        <Typography variant="body1">
          <strong>性別: </strong>{gender}
        </Typography>
      </Box>
    );
  };

  // 戻るボタン
  const handleBack = () => {
    navigate('/mbti-test', { state: { step: 3, mbtiType, zodiacSign, gender } });
  };

  // デバッグ情報リンク
  const DebugLink = () => (
    <Typography variant="caption" align="center" sx={{ mt: 2, display: 'block', cursor: 'pointer', color: 'text.secondary' }}>
      <Link onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? 'デバッグ情報を隠す' : 'デバッグ情報を表示'}
      </Link>
    </Typography>
  );

  // デバッグ情報の表示
  const DebugInfo = () => {
    if (!showDebug) return null;

    return (
      <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5', maxHeight: '300px', overflow: 'auto' }}>
        <Typography variant="subtitle2" gutterBottom>処理ログ:</Typography>
        {dataStructureLog.map((entry, index) => (
          <Typography key={index} variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
            {entry}
          </Typography>
        ))}

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>生データ:</Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(rawData, null, 2)}
        </Typography>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
          <PetsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          トラまろ　天命診断
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          {mbtiType} {zodiacSign}のあなたへのメッセージ
        </Typography>

        {getProfileInfo()}

        {formattedData ? (
          <Grid container spacing={3}>
            {Object.entries(formattedData).map(([category, text]) => (
              text && (
                <Grid item xs={12} key={category}>
                  <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category === '恋愛' && <FavoriteIcon color="error" />}
                      {category === '仕事' && <WorkIcon color="primary" />}
                      {category === '健康' && <HealthAndSafetyIcon color="success" />}
                      {category === 'お金' && <PaidIcon sx={{ color: '#FFD700' }} />}
                      {category}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" align="left" paragraph>
                      {text}
                    </Typography>
                  </Paper>
                </Grid>
              )
            ))}
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="body1" paragraph>
              結果を解析できませんでした。
            </Typography>
          </Paper>
        )}

        <DebugLink />
        <DebugInfo />

        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 4 }}
        >
          診断を再度行う
        </Button>
      </Box>
    </Container>
  );
};

export default DifyResultScreen;