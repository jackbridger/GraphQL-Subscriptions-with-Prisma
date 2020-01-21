import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


export default function ToDo({ title }) {


    return (
        <Card >
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>

            </CardContent>
        </Card>
    );
}